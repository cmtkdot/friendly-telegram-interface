import { MediaItem } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface MediaCardProps {
  item: MediaItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

const MediaCard = ({ item, isSelected, onToggleSelect }: MediaCardProps) => {
  const isVideo = item.media_type === "video";

  return (
    <Card className="group relative overflow-hidden glass-card hover:neo-glow transition-all duration-300">
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(item.id)}
          className="bg-white/10 border-white/20 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
        />
      </div>
      
      <CardContent className="p-0 flex flex-col h-full">
        <div className="aspect-video relative group-hover:scale-105 transition-transform duration-300">
          {isVideo ? (
            <video
              src={item.file_url}
              className="w-full h-full object-cover rounded-t-lg"
              controls
              preload="metadata"
            />
          ) : (
            <img
              src={item.file_url}
              alt={item.caption || "Media"}
              className="w-full h-full object-cover rounded-t-lg"
              loading="lazy"
            />
          )}
        </div>
        
        <div className="p-2 md:p-3 space-y-1.5 flex-1 flex flex-col bg-black/40 backdrop-blur-sm">
          {item.caption && (
            <p className="text-xs md:text-sm text-white line-clamp-2 flex-1">
              {item.caption}
            </p>
          )}
          
          <div className="flex justify-between items-center text-[10px] md:text-xs text-white/80 mt-auto">
            <span className="truncate max-w-[100px] md:max-w-[120px]">
              {item.chat?.title || "Unknown Channel"}
            </span>
            <span className="shrink-0">
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;