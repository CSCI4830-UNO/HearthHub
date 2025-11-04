import { BarChart3, TrendingUp, TrendingDown, DollarSign, Building2, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        <p className="text-muted-foreground">
          Insights into your rental portfolio performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,125</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              Year-over-year growth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tenant Retention</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              +2% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization would appear here</p>
                <p className="text-xs">Connect to analytics service to view charts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Occupancy Trends</CardTitle>
            <CardDescription>Property occupancy over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart visualization would appear here</p>
                <p className="text-xs">Connect to analytics service to view charts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Property Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Property Performance</CardTitle>
          <CardDescription>Revenue and occupancy by property</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Sunset Apartments - Unit 101", revenue: 2500, occupancy: "100%", trend: "+5%" },
              { name: "Downtown Loft", revenue: 3200, occupancy: "100%", trend: "+2%" },
              { name: "Garden View Suite", revenue: 4500, occupancy: "0%", trend: "Vacant" },
            ].map((property, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{property.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>Revenue: ${property.revenue.toLocaleString()}/month</span>
                    <span>Occupancy: {property.occupancy}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    property.trend.includes("+") ? "text-green-600" : 
                    property.trend === "Vacant" ? "text-orange-600" : "text-muted-foreground"
                  }`}>
                    {property.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

