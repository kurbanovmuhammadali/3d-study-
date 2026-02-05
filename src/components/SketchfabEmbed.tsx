import { motion } from "framer-motion";

interface SketchfabEmbedProps {
  modelId: string;
  title: string;
  className?: string;
}

export function SketchfabEmbed({ modelId, title, className = "" }: SketchfabEmbedProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full h-full ${className}`}
    >
      <iframe
        title={title}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        className="w-full h-full rounded-xl"
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0`}
      />
    </motion.div>
  );
}
