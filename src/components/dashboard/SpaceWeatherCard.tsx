
import { useQuery } from '@tanstack/react-query';
import { getSpaceWeatherData } from '@/lib/spaceWeather';
import { Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SpaceWeatherCard() {
  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['spaceWeather'],
    queryFn: getSpaceWeatherData,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-space-accent" size={20} />
            Space Weather Monitor
          </CardTitle>
          <CardDescription>Loading latest space weather data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-pulse text-space-muted">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-400">
            <Shield className="text-red-400" size={20} />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-space-muted">Unable to fetch space weather data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="text-space-accent" size={20} />
          Space Weather Monitor
        </CardTitle>
        <CardDescription>Real-time space weather conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weatherData && weatherData.length > 0 ? (
            weatherData.map((data, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="text-space-highlight" size={16} />
                  <span className="text-sm text-space-muted">
                    Updated: {new Date(data.modelCompletionTime).toLocaleString()}
                  </span>
                </div>
                {data.impactList && data.impactList.map((impact, i) => (
                  <div key={i} className="ml-6 mt-2">
                    <p className="text-sm text-white">Location: {impact.location}</p>
                    <p className="text-xs text-space-muted">
                      Expected Arrival: {new Date(impact.arrivalTime).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-space-muted">Kp Index:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        impact.kpIndex > 5 ? 'bg-red-500/20 text-red-400' :
                        impact.kpIndex > 3 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {impact.kpIndex}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-center text-space-muted">
              No active space weather alerts
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
