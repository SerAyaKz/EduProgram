import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/dashboard")
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box mt={4}>
        <Alert severity="error">Error loading dashboard: {error}</Alert>
      </Box>
    );
  if (!dashboardData)
    return (
      <Box mt={4}>
        <Alert severity="info">No dashboard data available.</Alert>
      </Box>
    );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Welcome to DDEduP Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Programs by Academic Degree */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Programs by Academic Degree
            </Typography>
            <Box height={300}>
              <ResponsiveBar
                data={dashboardData.programsByAcademicDegree}
                keys={["count"]}
                indexBy="academicDegree"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: "nivo" }}
                axisBottom={{
                  tickRotation: -45,
                }}
                axisLeft={{
                  legend: "Count",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                tooltip={({ id, value, indexValue }) => (
                  <strong>
                    {indexValue}: {value}
                  </strong>
                )}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Course Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Course Distribution
            </Typography>
            <Box height={300}>
              <ResponsivePie
                data={dashboardData.coursesBySelectiveStatus.map((item) => ({
                  id: item.isSelective ? "Selective" : "Required",
                  label: item.isSelective ? "Selective" : "Required",
                  value: item.count,
                }))}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: "paired" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            </Box>
          </Paper>
        </Grid>

        {/* User Activity */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              User Activity
            </Typography>
            <Box height={300}>
              <ResponsiveLine
                data={[
                  {
                    id: "Logins",
                    data: dashboardData.userActivityTimeline.map((item) => ({
                      x: item.date,
                      y: item.loginCount,
                    })),
                  },
                ]}
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: false,
                  reverse: false,
                }}
                axisBottom={{
                  orient: "bottom",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: "Date",
                  legendOffset: 36,
                  legendPosition: "middle",
                }}
                axisLeft={{
                  orient: "left",
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Login Count",
                  legendOffset: -40,
                  legendPosition: "middle",
                }}
                colors={{ scheme: "nivo" }}
                pointSize={10}
                pointColor={{ theme: "background" }}
                pointBorderWidth={2}
                pointBorderColor={{ from: "serieColor" }}
                pointLabelYOffset={-12}
                useMesh={true}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Program Health Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Program Health Overview
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Program</TableCell>
                  <TableCell>Learning Outcomes</TableCell>
                  <TableCell>Jobs</TableCell>
                  <TableCell>Standards</TableCell>
                  <TableCell>Recommendations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dashboardData.programHealthMetrics
                  .slice(0, 5)
                  .map((program, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{program.programName}</TableCell>
                      <TableCell>{program.learningOutcomes}</TableCell>
                      <TableCell>{program.jobs}</TableCell>
                      <TableCell>{program.standards}</TableCell>
                      <TableCell>{program.recommendations}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Course Distribution by Term */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Course Distribution by Term
            </Typography>
            <Box height={300}>
              <ResponsiveBar
                data={dashboardData.courseDistributionByTerm}
                keys={["courseCount"]}
                indexBy="term"
                margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: "nivo" }}
                axisBottom={{
                  tickRotation: -45,
                }}
                axisLeft={{
                  legend: "Course Count",
                  legendPosition: "middle",
                  legendOffset: -40,
                }}
                tooltip={({ id, value, indexValue }) => (
                  <strong>
                    {indexValue}: {value}
                  </strong>
                )}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Learning Outcomes per Program */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Learning Outcomes per Program
            </Typography>
            <Box height={300}>
              <ResponsiveBar
                data={dashboardData.learningOutcomesPerProgram.slice(0, 5)}
                keys={["outcomeCount"]}
                indexBy="programName"
                margin={{ top: 20, right: 20, bottom: 50, left: 100 }}
                layout="horizontal"
                padding={0.3}
                colors={{ scheme: "nivo" }}
                axisBottom={{
                  legend: "Outcome Count",
                  legendPosition: "middle",
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickRotation: -45,
                }}
                tooltip={({ id, value, indexValue }) => (
                  <strong>
                    {indexValue}: {value}
                  </strong>
                )}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Job Type Distribution */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Job Type Distribution
            </Typography>
            <Box height={300}>
              <ResponsivePie
                data={dashboardData.jobTypeDistribution.map((item) => ({
                  id: item.jobType,
                  label: item.jobType,
                  value: item.count,
                }))}
                margin={{
                  top: 40,
                  right: 80,
                  bottom: 80,

                  left: 80,
                }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colors={{ scheme: "nivo" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
                }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    symbolSize: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Most Assigned Courses */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top 10 Most Assigned Courses
            </Typography>
            <Box height={400}>
              <ResponsiveBar
                data={dashboardData.mostAssignedCourses.slice(0, 10)}
                keys={["assignedCount"]}
                indexBy="courseName"
                margin={{ top: 20, right: 30, bottom: 80, left: 150 }}
                layout="horizontal"
                padding={0.3}
                colors={{ scheme: "category10" }}
                axisBottom={{
                  legend: "Assigned Count",
                  legendPosition: "middle",
                  legendOffset: 32,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }}
                tooltip={({ id, value, indexValue }) => (
                  <strong>
                    {indexValue}: {value}
                  </strong>
                )}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
