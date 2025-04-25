
import { NasaImage } from '@/lib/nasa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export function NasaImageCard({ image }: { image: NasaImage }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card className="w-full overflow-hidden bg-space-blue/20 border border-white/10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl text-white">{image.title}</CardTitle>
        {image.date && (
          <CardDescription className="text-space-muted">
            {new Date(image.date).toLocaleDateString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <img
            src={image.url}
            alt={image.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
          />
          {isLoading && (
            <div className="absolute inset-0 bg-space-blue/20 animate-pulse" />
          )}
        </div>
        <p className="text-sm text-space-muted">{image.description}</p>
        {image.photographer && (
          <p className="text-xs text-space-muted">
            Credit: {image.photographer}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
