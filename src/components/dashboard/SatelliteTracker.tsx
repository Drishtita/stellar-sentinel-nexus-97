
import { useQuery } from '@tanstack/react-query';
import { getLatestSatellites } from '@/lib/spaceWeather';
import { Satellite } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SatelliteTracker() {
  const { data: satellites, isLoading, error } = useQuery({
    queryKey: ['satellites'],
    queryFn: () => getLatestSatellites(5),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="text-space-highlight" size={20} />
          Satellite Tracker
        </CardTitle>
        <CardDescription>Real-time satellite orbital data</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-pulse text-space-muted">Loading satellite data...</div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400">
            Unable to fetch satellite data
          </div>
        ) : (
          <div className="space-y-4">
            {satellites?.map((sat, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5">
                <h4 className="text-white font-medium mb-2">{sat.name}</h4>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-space-muted">{sat.lineOne}</p>
                  <p className="text-xs font-mono text-space-muted">{sat.lineTwo}</p>
                </div>
                <p className="text-xs text-space-muted mt-2">
                  Last Updated: {new Date(sat.date).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
