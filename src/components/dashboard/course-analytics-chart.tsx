import { useState, useMemo } from "react";
import { format, subDays, startOfDay, addDays, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CalendarIcon, TrendingUp, TrendingDown, MoreHorizontal, Download, RefreshCw, Settings, ChevronLeft, ChevronRight as ChevronRightIcon, BookOpen, Clock, Award, Target } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseAnalyticsChartProps {
  className?: string;
}

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateDataForRange = (from: Date, to: Date) => {
  const data = [];
  let currentDate = new Date(from);

  while (currentDate <= to) {
    const seed = currentDate.getTime() / 86400000;
    const baseLessons = 8 + Math.sin(seed / 7) * 3;
    const baseTime = 45 + Math.sin(seed / 7) * 15;

    data.push({
      date: new Date(currentDate),
      dateStr: format(currentDate, "d. MMM", { locale: cs }),
      dokonceneLekce: Math.floor(baseLessons + seededRandom(seed * 1) * 4),
      casStudia: Math.floor(baseTime + seededRandom(seed * 2) * 20),
      pokrok: Math.floor(65 + seededRandom(seed * 3) * 25),
    });

    currentDate = addDays(currentDate, 1);
  }
  return data;
};

const chartConfig = {
  dokonceneLekce: { label: "Dokončené lekce", color: "var(--chart-1)" },
  casStudia: { label: "Čas studia (min)", color: "var(--chart-2)" },
  pokrok: { label: "Pokrok (%)", color: "var(--chart-3)" },
} satisfies ChartConfig;

export const CourseAnalyticsChart = ({ className }: CourseAnalyticsChartProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const filteredData = useMemo(() => {
    if (!dateRange?.from) {
      return generateDataForRange(subDays(new Date(), 29), new Date());
    }
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? startOfDay(dateRange.to) : from;
    return generateDataForRange(from, to);
  }, [dateRange]);

  const stats = useMemo(() => {
    const celkemLekce = filteredData.reduce((sum, item) => sum + item.dokonceneLekce, 0);
    const celkemCas = filteredData.reduce((sum, item) => sum + item.casStudia, 0);
    const prumernyPokrok = filteredData.length > 0
      ? Math.round(filteredData.reduce((sum, item) => sum + item.pokrok, 0) / filteredData.length)
      : 0;
    const aktivniDny = filteredData.filter(item => item.dokonceneLekce > 0).length;
    return { celkemLekce, celkemCas, prumernyPokrok, aktivniDny };
  }, [filteredData]);

  const daysDiff = dateRange?.from && dateRange?.to
    ? differenceInDays(dateRange.to, dateRange.from) + 1
    : 30;

  const navigateRange = (direction: "prev" | "next") => {
    if (!dateRange?.from || !dateRange?.to) return;
    const shift = direction === "prev" ? -daysDiff : daysDiff;
    setDateRange({
      from: addDays(dateRange.from, shift),
      to: addDays(dateRange.to, shift),
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Přehled studia</h2>
          <p className="text-muted-foreground">
            {daysDiff} {daysDiff === 1 ? "den" : daysDiff < 5 ? "dny" : "dní"}
            {dateRange?.from && ` · ${format(dateRange.from, "d. MMM", { locale: cs })} - ${format(dateRange.to || dateRange.from, "d. MMM yyyy", { locale: cs })}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border">
            <Button variant="ghost" size="icon" className="rounded-r-none" onClick={() => navigateRange("prev")}>
              <ChevronLeft className="size-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-none border-x px-3">
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange?.from ? format(dateRange.from, "d. MMM", { locale: cs }) : "Začátek"} - {dateRange?.to ? format(dateRange.to, "d. MMM", { locale: cs }) : "Konec"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={dateRange}
                  onSelect={setDateRange}
                  locale={cs}
                />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="rounded-l-none" onClick={() => navigateRange("next")}>
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Download className="mr-2 size-4" /> Exportovat CSV</DropdownMenuItem>
              <DropdownMenuItem><RefreshCw className="mr-2 size-4" /> Obnovit</DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 size-4" /> Nastavení</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Dokončené lekce", value: stats.celkemLekce.toLocaleString(), change: 12.5, icon: BookOpen },
          { label: "Čas studia", value: `${Math.floor(stats.celkemCas / 60)}h ${stats.celkemCas % 60}m`, change: 18.3, icon: Clock },
          { label: "Průměrný pokrok", value: `${stats.prumernyPokrok}%`, change: 5.7, icon: Target },
          { label: "Aktivní dny", value: stats.aktivniDny.toLocaleString(), change: 8.2, icon: Award },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span className={cn("flex items-center text-sm", stat.change >= 0 ? "text-green-600" : "text-red-600")}>
                    {stat.change >= 0 ? <TrendingUp className="mr-1 size-3" /> : <TrendingDown className="mr-1 size-3" />}
                    {stat.change >= 0 ? "+" : ""}{stat.change}%
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Dokončené lekce</CardTitle>
            <CardDescription>Počet dokončených lekcí za období</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tickMargin={8} fontSize={11} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="dokonceneLekce" fill="var(--color-dokonceneLekce)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Čas studia</CardTitle>
            <CardDescription>Minuty strávené studiem</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="casGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-casStudia)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-casStudia)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tickMargin={8} fontSize={11} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="casStudia" stroke="var(--color-casStudia)" strokeWidth={2} fill="url(#casGrad)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informace o kurzech</CardTitle>
          <CardDescription>Podrobnosti o vašem studijním pokroku</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Celkový pokrok</span>
                </div>
                <p className="text-2xl font-bold">{stats.prumernyPokrok}%</p>
                <p className="text-xs text-muted-foreground">Průměrný pokrok ve všech kurzech</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Cílové lekce</span>
                </div>
                <p className="text-2xl font-bold">{Math.round(stats.celkemLekce / daysDiff * 7)}</p>
                <p className="text-xs text-muted-foreground">Průměr na týden</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Střední čas</span>
                </div>
                <p className="text-2xl font-bold">{stats.celkemLekce > 0 ? Math.round(stats.celkemCas / stats.celkemLekce) : 0} min</p>
                <p className="text-xs text-muted-foreground">Na jednu lekci</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Aktivita studia</p>
                  <p className="text-xs text-muted-foreground">
                    {stats.aktivniDny} {stats.aktivniDny === 1 ? "aktivní den" : stats.aktivniDny < 5 ? "aktivní dny" : "aktivních dní"} z {daysDiff}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{Math.round((stats.aktivniDny / daysDiff) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Konzistence</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
