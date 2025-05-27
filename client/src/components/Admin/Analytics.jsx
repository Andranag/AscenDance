import React, { useEffect, useRef } from 'react';
import { Card, Grid, Statistic, Segment } from 'semantic-ui-react';
import { useAuth } from '../../contexts/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const completionChartRef = useRef(null);
  const activityChartRef = useRef(null);
  const enrollmentChartRef = useRef(null);

  useEffect(() => {
    // Draw completion chart
    if (completionChartRef.current) {
      const ctx = completionChartRef.current.getContext('2d');
      const data = [
        { name: 'Jan', completion: 4000 },
        { name: 'Feb', completion: 3000 },
        { name: 'Mar', completion: 2000 },
        { name: 'Apr', completion: 2780 },
        { name: 'May', completion: 1890 },
        { name: 'Jun', completion: 2390 },
        { name: 'Jul', completion: 3490 },
      ];
      ctx.clearRect(0, 0, 600, 300);
      drawLineChart(ctx, data, 'completion', '#8884d8');
    }

    // Draw activity chart
    if (activityChartRef.current) {
      const ctx = activityChartRef.current.getContext('2d');
      const data = [
        { name: 'Mon', users: 4000 },
        { name: 'Tue', users: 3000 },
        { name: 'Wed', users: 2000 },
        { name: 'Thu', users: 2780 },
        { name: 'Fri', users: 1890 },
        { name: 'Sat', users: 2390 },
        { name: 'Sun', users: 3490 },
      ];
      ctx.clearRect(0, 0, 300, 200);
      drawBarChart(ctx, data, 'users', '#8884d8');
    }

    // Draw enrollment chart
    if (enrollmentChartRef.current) {
      const ctx = enrollmentChartRef.current.getContext('2d');
      const data = [
        { name: 'Course 1', enrollments: 1200 },
        { name: 'Course 2', enrollments: 980 },
        { name: 'Course 3', enrollments: 1400 },
        { name: 'Course 4', enrollments: 1000 },
        { name: 'Course 5', enrollments: 1300 },
      ];
      ctx.clearRect(0, 0, 300, 200);
      drawBarChart(ctx, data, 'enrollments', '#82ca9d');
    }
  }, []);

  const drawLineChart = (ctx, data, key, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    const xStep = 600 / (data.length - 1);
    const maxValue = Math.max(...data.map(d => d[key]));
    const yScale = 280 / maxValue;

    data.forEach((d, i) => {
      const x = i * xStep;
      const y = 300 - (d[key] * yScale);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  const drawBarChart = (ctx, data, key, color) => {
    const barWidth = 25;
    const maxValue = Math.max(...data.map(d => d[key]));
    const yScale = 180 / maxValue;

    data.forEach((d, i) => {
      const x = i * (barWidth + 10);
      const y = 200 - (d[key] * yScale);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth, d[key] * yScale);
    });
  };

  return (
    <div>
      <h1>Analytics Dashboard</h1>
      
      <Grid columns={3} stackable>
        <Grid.Row>
          <Grid.Column>
            <Card>
              <Card.Content>
                <Card.Header>Total Users</Card.Header>
                <Card.Description>
                  <Statistic>
                    <Statistic.Value>1,234</Statistic.Value>
                    <Statistic.Label>Users</Statistic.Label>
                  </Statistic>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          
          <Grid.Column>
            <Card>
              <Card.Content>
                <Card.Header>Total Courses</Card.Header>
                <Card.Description>
                  <Statistic>
                    <Statistic.Value>45</Statistic.Value>
                    <Statistic.Label>Courses</Statistic.Label>
                  </Statistic>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          
          <Grid.Column>
            <Card>
              <Card.Content>
                <Card.Header>Active Users</Card.Header>
                <Card.Description>
                  <Statistic>
                    <Statistic.Value>850</Statistic.Value>
                    <Statistic.Label>Active</Statistic.Label>
                  </Statistic>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid.Row>
      </Grid>

      <Segment>
        <h2>Course Completion Rate</h2>
        <canvas ref={completionChartRef} width="600" height="300"></canvas>
      </Segment>

      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column>
            <Segment>
              <h3>User Activity</h3>
              <canvas ref={activityChartRef} width="300" height="200"></canvas>
            </Segment>
          </Grid.Column>
          
          <Grid.Column>
            <Segment>
              <h3>Course Enrollment</h3>
              <canvas ref={enrollmentChartRef} width="300" height="200"></canvas>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Analytics;
