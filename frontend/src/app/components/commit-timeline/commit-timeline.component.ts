import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';
import { CommitDataPoint } from '../../services/github.service';

@Component({
  selector: 'app-commit-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `<div #chart class="chart-container"></div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 300px;
    }
    :host ::ng-deep svg text { fill: #9ca3af; }
    :host ::ng-deep .domain, :host ::ng-deep .tick line { stroke: rgba(255,255,255,0.1); }
  `]
})
export class CommitTimelineComponent implements OnChanges, AfterViewInit {
  @Input() commits: CommitDataPoint[] = [];
  @ViewChild('chart') chartRef!: ElementRef;
  private initialized = false;

  ngAfterViewInit() {
    this.initialized = true;
    if (this.commits.length) this.buildChart();
  }

  ngOnChanges() {
    if (this.initialized && this.commits.length) this.buildChart();
  }

  buildChart() {
    const el = this.chartRef.nativeElement;
    d3.select(el).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = el.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Group commits by week
    const grouped = d3.rollup(
      this.commits,
      v => v.length,
      d => d3.timeWeek.floor(new Date(d.date))
    );

    const data = Array.from(grouped, ([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const svg = d3.select(el)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) || 0])
      .range([height, 0]);

    // Gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', height);

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#a78bfa').attr('stop-opacity', 0.6);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#a78bfa').attr('stop-opacity', 0);

    // Area
    const area = d3.area<{date: Date, count: number}>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.count))
      .curve(d3.curveCatmullRom);

    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area);

    // Line
    const line = d3.line<{date: Date, count: number}>()
      .x(d => x(d.date))
      .y(d => y(d.count))
      .curve(d3.curveCatmullRom);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#a78bfa')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(6));

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));
  }
}