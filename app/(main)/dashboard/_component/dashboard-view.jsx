"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const DashboardView = ({ insights }) => {
  // Transform salary data for the chart
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.nextUpdate),
    { addSuffix: true }
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 gradient-secondary rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold gradient-text-secondary uppercase tracking-wider">Dashboard Overview</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black leading-tight pb-2">
            <span className="gradient-title block">Industry</span>
            <span className="gradient-title block">Intelligence</span>
          </h1>
          <p className="text-foreground/70 text-xl font-medium">
            🚀 Stay ahead with <span className="gradient-text-accent font-bold">real-time market intelligence</span> and data-driven insights
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Badge variant="outline" className="glass-card border-2 border-emerald-500/30 px-4 py-2 text-base font-semibold">
            <div className="relative mr-3">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
            </div>
            Live Data • Updated: {lastUpdatedDate}
          </Badge>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="glass-card border-2 border-blue-500/30 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 gradient-secondary opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-1 h-full gradient-secondary"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-foreground/80">
              📈 Market Outlook
            </CardTitle>
            <div className="p-3 rounded-xl gradient-secondary group-hover:scale-110 transition-all duration-300">
              <OutlookIcon className={`h-6 w-6 text-white`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black mb-3 gradient-text-secondary">{insights.marketOutlook}</div>
            <p className="text-sm text-muted-foreground font-medium">
              🔄 Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-2 border-emerald-500/30 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 gradient-success opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-1 h-full gradient-success"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-foreground/80">
              📊 Industry Growth
            </CardTitle>
            <div className="p-3 rounded-xl gradient-success group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black mb-3">
              <span className="bg-gradient-to-r from-emerald-500 to-green-600 text-transparent bg-clip-text">
                {insights.growthRate.toFixed(1)}%
              </span>
            </div>
            <div className="relative mt-3">
              <div className="h-3 w-full rounded-full bg-emerald-100/50 overflow-hidden">
                <div className="h-full gradient-success rounded-full transition-all duration-1000" style={{width: `${insights.growthRate}%`}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-2 border-orange-500/30 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 gradient-warning opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-1 h-full gradient-warning"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-foreground/80">
              💼 Market Demand
            </CardTitle>
            <div className="p-3 rounded-xl gradient-warning group-hover:scale-110 transition-all duration-300">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black mb-3">
              <span className={`bg-gradient-to-r ${getDemandLevelColor(insights.demandLevel) === 'bg-green-500' ? 'from-green-500 to-emerald-600' : getDemandLevelColor(insights.demandLevel) === 'bg-yellow-500' ? 'from-yellow-500 to-orange-600' : 'from-red-500 to-pink-600'} text-transparent bg-clip-text`}>
                {insights.demandLevel}
              </span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-gray-200/50 mt-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${getDemandLevelColor(
                  insights.demandLevel
                )} shadow-lg`}
                style={{ width: insights.demandLevel.toLowerCase() === 'high' ? '100%' : insights.demandLevel.toLowerCase() === 'medium' ? '70%' : '40%' }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-2 border-purple-500/30 card-hover group relative overflow-hidden">
          <div className="absolute inset-0 gradient-accent opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 w-1 h-full gradient-accent"></div>
          <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-foreground/80">
              🧠 Top Skills
            </CardTitle>
            <div className="p-3 rounded-xl gradient-accent group-hover:scale-110 transition-all duration-300">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-wrap gap-3">
              {insights.topSkills.map((skill, index) => (
                <Badge key={skill} className={`glass-card border-2 hover:scale-105 transition-all duration-300 px-3 py-2 font-semibold backdrop-blur-sm ${
                  index % 4 === 0 ? 'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-300' :
                  index % 4 === 1 ? 'border-purple-500/50 bg-purple-500/10 text-purple-700 dark:text-purple-300' :
                  index % 4 === 2 ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' :
                  'border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-300'
                }`}>
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="glass-morphism border-2 border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5"></div>
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10">
              <BarChart className="h-5 w-5 text-indigo-500" />
            </div>
            <CardTitle className="text-2xl gradient-text-secondary">Salary Ranges by Role</CardTitle>
          </div>
          <CardDescription className="text-base">
            Comprehensive salary analysis across different positions (in thousands USD)
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="glass-morphism border border-white/20 rounded-xl p-4 shadow-2xl">
                          <p className="font-bold text-lg mb-2 gradient-text-secondary">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm flex justify-between gap-4">
                              <span>{item.name}:</span>
                              <span className="font-semibold">${item.value}K</span>
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="hsl(197, 70%, 55%)" name="Min Salary (K)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="median" fill="hsl(237, 85%, 64%)" name="Median Salary (K)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" fill="hsl(287, 85%, 74%)" name="Max Salary (K)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-morphism border-2 border-white/20 card-hover relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="text-xl gradient-text-secondary">Key Industry Trends</CardTitle>
            </div>
            <CardDescription className="text-base">
              Current trends shaping the industry landscape
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-emerald-500/5 transition-colors duration-300">
                  <div className="h-2 w-2 mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <span className="text-sm leading-relaxed">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-2 border-white/20 card-hover relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5"></div>
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                <Brain className="h-5 w-5 text-violet-500" />
              </div>
              <CardTitle className="text-xl gradient-text-secondary">Recommended Skills</CardTitle>
            </div>
            <CardDescription className="text-base">Skills to consider developing for career growth</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-wrap gap-3">
              {insights.recommendedSkills.map((skill, index) => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="glass-morphism border border-violet-500/20 hover:bg-violet-500/10 hover:border-violet-500/40 transition-all duration-300 px-3 py-1.5"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
