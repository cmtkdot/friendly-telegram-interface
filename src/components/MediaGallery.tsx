import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type MediaItem = Database['public']['Tables']['media']['Row'] & {
  metadata: {
    telegram_file_id: string;
    width: number;
    height: number;
    file_size: number;
  } | null;
};

const MediaGallery = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMedia();
    console.log("Setting up realtime subscription");
    const subscription = supabase
      .channel('media_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'media' 
      }, payload => {
        console.log('New media received:', payload);
        const newMedia = payload.new as MediaItem;
        setMedia(prev => [newMedia, ...prev]);
        toast({
          title: "New Media Received",
          description: newMedia.caption || "New media file has been added",
        });
      })
      .subscribe();

    return () => {
      console.log("Cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const fetchMedia = async () => {
    try {
      console.log("Fetching media...");
      setIsLoading(true);
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      console.log("Fetched media data:", data);
      setMedia(data as MediaItem[]);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast({
        title: "Error",
        description: "Failed to load media gallery",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  console.log("Current media state:", media);
  console.log("Is loading:", isLoading);

  if (isLoading) {
    return (
      <div className="bg-transparent rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Media Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="w-full h-48 rounded-lg bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white">Telegram Media Gallery</h2>
      {media.length === 0 ? (
        <p className="text-center text-gray-400 py-8">
          No media files yet. Send some media to your Telegram bot!
        </p>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {media.map((item) => (
              <div 
                key={item.id} 
                className="relative group backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={item.file_url}
                  alt={item.caption || 'Telegram Media'}
                  className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="p-3 backdrop-blur-lg bg-black/40">
                  {item.caption && (
                    <p className="font-medium text-white mb-2">{item.caption}</p>
                  )}
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Type: {item.media_type}</p>
                    {item.metadata && (
                      <>
                        <p>Size: {formatFileSize(item.metadata.file_size)}</p>
                        <p>Dimensions: {item.metadata.width}x{item.metadata.height}</p>
                      </>
                    )}
                    <p>Added: {formatDate(item.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default MediaGallery;