"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DashboardNav } from "@/components/dashboard-nav";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { exportResultsToExcel } from "@/lib/export-excel";
import { Download, Home } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getStats);

  if (!stats) {
    return (
      <div className="min-h-full flex-1 bg-muted/30">
        <DashboardNav />
        <div className="flex items-center justify-center p-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex-1 bg-muted/30">
      <DashboardNav />
      <main className="mx-auto max-w-7xl space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              All participants who have completed the quiz
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link href="/questions" className={cn(buttonVariants())}>
              Manage Questions
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Participants</CardDescription>
              <CardTitle className="text-4xl">{stats.totalParticipants}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Highest Score</CardDescription>
              <CardTitle className="text-4xl">{stats.highestScore}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                Name, phone number, and score for everyone who played
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={!stats.participants.length}
              onClick={() => exportResultsToExcel(stats.participants)}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </CardHeader>
          <CardContent>
            {stats.participants.length === 0 ? (
              <p className="text-muted-foreground">No participants yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Answered</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.participants.map((p, index) => (
                    <TableRow key={p._id}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>{p.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{p.score}</Badge>
                      </TableCell>
                      <TableCell>{p.answeredQuestions}</TableCell>
                      <TableCell>{formatDate(p.completedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
