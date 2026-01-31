import { useState, useMemo } from "react";
import { format, subDays, startOfDay, addDays, differenceInDays } from "date-fns";
import { cs } from "date-fns/locale";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, ComposedChart } from "recharts";
import { CalendarIcon, TrendingUp, TrendingDown, MoreHorizontal, Download, RefreshCw, Settings, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
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
  ChartLegend,
  ChartLegendContent,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface PhysioAnalyticsChartProps {
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
    const basePacienti = 15 + Math.sin(seed / 7) * 5;
    const baseUspesnost = 85 + Math.sin(seed / 7) * 10;

    data.push({
      date: new Date(currentDate),
      dateStr: format(currentDate, "d. MMM", { locale: cs }),
      pacienti: Math.floor(basePacienti + seededRandom(seed * 1) * 8),
      terapie: Math.floor((basePacienti + seededRandom(seed * 2) * 8) * 1.2),
      uspesnost: Math.floor(baseUspesnost + seededRandom(seed * 3) * 5),
      noviPacienti: Math.floor(seededRandom(seed * 4) * 5) + 1,
      vracejiciSe: Math.floor(seededRandom(seed * 5) * 10) + 8,
      hodnoceni: (4.2 + seededRandom(seed * 6) * 0.8).toFixed(1),
    });

    currentDate = addDays(currentDate, 1);
  }
  return data;
};

const hourlyData = Array.from({ length: 24 }, (_, i) => {
  const seed = i * 1000;
  return {
    hour: `${i.toString().padStart(2, "0")}:00`,
    rezervace: Math.floor(seededRandom(seed) * 8) + (i >= 8 && i <= 18 ? 5 : 0),
    terapie: Math.floor(seededRandom(seed + 1) * 6) + (i >= 8 && i <= 18 ? 3 : 0),
  };
});

const terapieTypeData = [
  { name: "Masáže", value: 35, fill: "var(--chart-1)" },
  { name: "Rehabilitace", value: 40, fill: "var(--chart-2)" },
  { name: "Cvičení", value: 25, fill: "var(--chart-3)" },
];

const terapieConfig = {
  Masáže: { label: "Masáže", color: "var(--chart-1)" },
  Rehabilitace: { label: "Rehabilitace", color: "var(--chart-2)" },
  Cvičení: { label: "Cvičení", color: "var(--chart-3)" },
} satisfies ChartConfig;

const mainConfig = {
  pacienti: { label: "Pacienti", color: "var(--chart-1)" },
  terapie: { label: "Terapie", color: "var(--chart-2)" },
  uspesnost: { label: "Úspěšnost (%)", color: "var(--chart-3)" },
} satisfies ChartConfig;

const pacientConfig = {
  noviPacienti: { label: "Noví", color: "var(--chart-1)" },
  vracejiciSe: { label: "Vracející se", color: "var(--chart-2)" },
} satisfies ChartConfig;

const hourlyConfig = {
  rezervace: { label: "Rezervace", color: "var(--chart-1)" },
  terapie: { label: "Terapie", color: "var(--chart-3)" },
} satisfies ChartConfig;

export const PhysioAnalyticsChart = ({ className }: PhysioAnalyticsChartProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [chartView, setChartView] = useState<"pacienti" | "terapie" | "uspesnost">("pacienti");

  const filteredData = useMemo(() => {
    if (!dateRange?.from) {
      return generateDataForRange(subDays(new Date(), 29), new Date());
    }
    const from = startOfDay(dateRange.from);
    const to = dateRange.to ? startOfDay(dateRange.to) : from;
    return generateDataForRange(from, to);
  }, [dateRange]);

  const stats = useMemo(() => {
    const celkemPacienti = filteredData.reduce((sum, item) => sum + item.pacienti, 0);
    const celkemTerapie = filteredData.reduce((sum, item) => sum + item.terapie, 0);
    const prumernaUspesnost = filteredData.length > 0
      ? Math.round(filteredData.reduce((sum, item) => sum + item.uspesnost, 0) / filteredData.length)
      : 0;
    const celkemNoviPacienti = filteredData.reduce((sum, item) => sum + item.noviPacienti, 0);
    const prumerneHodnoceni = filteredData.length > 0
      ? (filteredData.reduce((sum, item) => sum + parseFloat(item.hodnoceni), 0) / filteredData.length).toFixed(1)
      : "0.0";
    return { celkemPacienti, celkemTerapie, prumernaUspesnost, celkemNoviPacienti, prumerneHodnoceni };
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
          <h2 className="text-2xl font-bold tracking-tight">Přehled výkonnosti</h2>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Celkem pacientů", value: stats.celkemPacienti.toLocaleString(), change: 8.2 },
          { label: "Celkem terapií", value: stats.celkemTerapie.toLocaleString(), change: 12.5 },
          { label: "Úspěšnost léčby", value: `${stats.prumernaUspesnost}%`, change: 5.3 },
          { label: "Noví pacienti", value: stats.celkemNoviPacienti.toLocaleString(), change: 15.7 },
          { label: "Hodnocení", value: stats.prumerneHodnoceni, change: 3.2 },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <span className={cn("flex items-center text-sm", stat.change >= 0 ? "text-green-600" : "text-red-600")}>
                  {stat.change >= 0 ? <TrendingUp className="mr-1 size-3" /> : <TrendingDown className="mr-1 size-3" />}
                  {stat.change >= 0 ? "+" : ""}{stat.change}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Tabs value={chartView} onValueChange={(v) => setChartView(v as typeof chartView)}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Přehled činnosti</CardTitle>
              <CardDescription>Pacienti, terapie a úspěšnost</CardDescription>
            </div>
              <TabsList className="h-8">
                <TabsTrigger value="pacienti" className="text-xs">Pacienti</TabsTrigger>
                <TabsTrigger value="terapie" className="text-xs">Terapie</TabsTrigger>
                <TabsTrigger value="uspesnost" className="text-xs">Úspěšnost</TabsTrigger>
              </TabsList>
          </CardHeader>
          <CardContent>
              <TabsContent value="pacienti" className="mt-0">
            <ChartContainer config={mainConfig} className="h-72 w-full">
                  <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="pacGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-pacienti)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-pacienti)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tickMargin={8} fontSize={11} interval="preserveStartEnd" />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                    <Area type="monotone" dataKey="pacienti" stroke="var(--color-pacienti)" strokeWidth={2} fill="url(#pacGrad)" />
                  </AreaChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="terapie" className="mt-0">
                <ChartContainer config={mainConfig} className="h-72 w-full">
                  <BarChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tickMargin={8} fontSize={11} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="terapie" fill="var(--color-terapie)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </TabsContent>
              <TabsContent value="uspesnost" className="mt-0">
                <ChartContainer config={mainConfig} className="h-72 w-full">
                  <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tickMargin={8} fontSize={11} interval="preserveStartEnd" />
                    <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={11} domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="uspesnost" stroke="var(--color-uspesnost)" strokeWidth={2} dot={false} />
                  </LineChart>
            </ChartContainer>
              </TabsContent>
          </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Typy terapií</CardTitle>
            <CardDescription>Rozdělení podle typu</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ChartContainer config={terapieConfig} className="mx-auto aspect-square h-40">
                <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel nameKey="name" />}
                />
                  <Pie
                    data={terapieTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  nameKey="name"
                    strokeWidth={0}
                />
                </PieChart>
            </ChartContainer>
            <div className="w-full space-y-2">
              {terapieTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-3 rounded-sm" style={{ backgroundColor: item.fill }} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Typy pacientů</CardTitle>
            <CardDescription>Noví vs. vracející se</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={pacientConfig} className="h-48 w-full">
              <BarChart data={filteredData.slice(-14)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tickMargin={8} fontSize={10} />
                <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="noviPacienti" stackId="a" fill="var(--color-noviPacienti)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="vracejiciSe" stackId="a" fill="var(--color-vracejiciSe)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Hodinový přehled</CardTitle>
            <CardDescription>Rezervace a terapie podle hodiny (dnes)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hourlyConfig} className="h-48 w-full">
              <ComposedChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tickMargin={8} fontSize={10} interval={2} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tickMargin={8} fontSize={10} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tickMargin={8} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="rezervace" fill="var(--color-rezervace)" radius={[2, 2, 0, 0]} opacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="terapie" stroke="var(--color-terapie)" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
