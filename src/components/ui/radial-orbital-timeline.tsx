"use client";
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
  badge?: string;
  title?: string;
}

/* Hovering a node opens its card immediately, so visitors discover
   there's content behind each one. */
const HOVER_OPEN_DELAY = 0;

export default function RadialOrbitalTimeline({
  timelineData,
  badge = "Pillar 1",
  title = "Research & Development",
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) newState[parseInt(key)] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = timelineData.find((item) => item.id === id)?.relatedIds || [];
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulseEffect[relId] = true; });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  const handleNodeEnter = (id: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      toggleItemIfClosed(id);
    }, HOVER_OPEN_DELAY);
  };

  const handleNodeLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const toggleItemIfClosed = (id: number) => {
    setExpandedItems((prev) => {
      if (prev[id]) return prev;
      const newState: Record<number, boolean> = {};
      newState[id] = true;
      setActiveNodeId(id);
      setAutoRotate(false);
      const relatedItems =
        timelineData.find((item) => item.id === id)?.relatedIds || [];
      const newPulseEffect: Record<number, boolean> = {};
      relatedItems.forEach((relId) => {
        newPulseEffect[relId] = true;
      });
      setPulseEffect(newPulseEffect);
      centerViewOnNode(id);
      return newState;
    });
  };

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout | undefined;
    if (autoRotate) {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => (prev + 0.25) % 360);
      }, 50);
    }
    return () => { if (rotationTimer) clearInterval(rotationTimer); };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    if (nodeIndex === -1) return;
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 220;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.3, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-white bg-[#6B21E8] border-[#6B21E8]";
      case "in-progress":
        return "text-[#4C0F9E] bg-[#E9D5FF] border-[#C084FC] animate-pulse";
      case "pending":
        return "text-[#6B7280] bg-[#F3F4F6] border-[#1A1A1A]/10";
      default:
        return "text-white bg-[#6B7280]";
    }
  };

  return (
    <div
      className="w-full h-[650px] flex flex-col items-center justify-center bg-white overflow-hidden border border-[#1A1A1A]/10 rounded-3xl relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="absolute top-8 left-8 z-30 pointer-events-none">
        <span className="text-xs font-medium tracking-wide text-[#6B21E8] block mb-1">{badge}</span>
        <h3 className="text-xl font-medium tracking-tight text-[#1A1A1A]">{title}</h3>
      </div>

      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px" }}
        >
          {/* Central Reactor Orb */}
          <div className="absolute w-20 h-20 rounded-full bg-[#6B21E8] flex items-center justify-center z-10 shadow-[0_8px_24px_rgba(107,33,232,0.25)]">
            <div className="absolute w-24 h-24 rounded-full border border-[#6B21E8]/25 animate-ping opacity-60"></div>
            <div className="absolute w-32 h-32 rounded-full border border-[#6B21E8]/15 animate-ping opacity-30" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-10 h-10 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-xs font-mono font-bold text-white">RCR</div>
          </div>

          {/* Orbit Line Ring */}
          <div className="absolute w-[440px] h-[440px] rounded-full border border-[#1A1A1A]/10 pointer-events-none"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = activeNodeId ? item.relatedIds.includes(activeNodeId) : false;
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 ease-out cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                onMouseEnter={() => handleNodeEnter(item.id)}
                onMouseLeave={handleNodeLeave}
              >
                {/* Outer Energy Layer Halo */}
                <div
                  className={`absolute rounded-full -inset-4 transition-opacity duration-500 ${isPulsing ? "animate-pulse" : "opacity-40 group-hover:opacity-100"}`}
                  style={{
                    background: `radial-gradient(circle, rgba(107,33,232,0.15) 0%, rgba(0,0,0,0) 70%)`,
                    width: `${item.energy * 0.6 + 48}px`,
                    height: `${item.energy * 0.6 + 48}px`,
                    left: `-${(item.energy * 0.6 + 48 - 40) / 2}px`,
                    top: `-${(item.energy * 0.6 + 48 - 40) / 2}px`,
                  }}
                ></div>

                {/* The Interactive Node Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform border-2 relative z-10
                    ${isExpanded ? "bg-[#6B21E8] text-white border-[#6B21E8] scale-125 shadow-[0_8px_20px_rgba(107,33,232,0.3)]" :
                      isRelated ? "bg-[#E9D5FF] text-[#4C0F9E] border-[#C084FC]" : "bg-white text-[#6B7280] border-[#1A1A1A]/20 hover:border-[#6B21E8] hover:text-[#1A1A1A]"}`}
                >
                  <span className="text-[9px] font-mono font-bold block leading-none mb-0.5 opacity-60">{item.id}</span>
                  <Icon size={14} />
                </div>

                {/* Micro Floating Title Label */}
                <div
                  className={`absolute top-14 left-1/2 -translate-x-1/2 text-center whitespace-nowrap text-[11px] font-medium tracking-wide transition-all duration-300
                    ${isExpanded ? "text-[#1A1A1A] font-semibold scale-105" : isRelated ? "text-[#6B21E8]" : "text-[#6B7280]"}`}
                >
                  {item.title}
                </div>

                {/* Floating Content Card Metadata Overlay */}
                {isExpanded && (
                  <Card className="absolute top-24 left-1/2 -translate-x-1/2 w-72 bg-white border border-[#1A1A1A]/10 shadow-[0_16px_48px_rgba(26,26,26,0.14)] overflow-visible z-50">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[#6B21E8]/50"></div>
                    <CardHeader className="pb-2 p-4">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 py-0.5 text-[9px] tracking-wider font-mono uppercase ${getStatusStyles(item.status)}`}>
                          {item.status.replace("-", " ")}
                        </Badge>
                        <span className="text-[10px] font-mono text-[#6B7280]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-sm font-semibold text-[#1A1A1A] mt-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs leading-relaxed p-4 pt-0">
                      <p className="text-[#4B5563]">{item.content}</p>

                      {/* Energy / Progress Level Metabar */}
                      <div className="mt-4 pt-3 border-t border-[#1A1A1A]/8">
                        <div className="flex justify-between items-center text-[10px] mb-1 text-[#6B7280]">
                          <span className="flex items-center gap-1">
                            <Zap size={10} className="text-[#6B21E8]" />
                            Stage progress
                          </span>
                          <span className="font-medium text-[#1A1A1A]">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-[#E9D5FF]/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6B21E8]"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Related Connected Operational Nodes Trigger Links */}
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#1A1A1A]/8">
                          <div className="flex items-center gap-1 mb-2 text-[#6B7280]">
                            <Link size={10} className="text-[#6B21E8]" />
                            <span className="text-[10px] font-medium">Connected stages</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {item.relatedIds.map((relatedId) => {
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  className="flex items-center h-6 px-2 py-0 text-[10px] rounded-md border-[#1A1A1A]/15 bg-transparent hover:bg-[#E9D5FF]/40 text-[#6B7280] hover:text-[#6B21E8] transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  Stage 0{relatedId}
                                  <ArrowRight size={8} className="ml-1 opacity-70" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
