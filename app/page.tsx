"use client";

import { useRef, useState } from "react";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import * as htmlToImage from "html-to-image";

const albums = [
  {
    title: "Petals for Armor",
    cover: "/img/petals-for-armor.png",
    accent: "from-pink-100 to-pink-50",
    songs: [
      "Simmer",
      "Leave It Alone",
      "Cinnamon",
      "Creepin'",
      "Sudden Desire",
      "Dead Horse",
      "My Friend",
      "Over Yet",
      "Why We Ever",
      "Roses/Lotus/Violet/Iris",
      "Pure Love",
      "Taken",
      "Sugar on the Rim",
      "Watch Me While I Bloom",
      "Crystal Clear",
    ],
  },

  {
    title: "FLOWERS for VASES / descansos",
    cover: "/img/flowers-for-vases.png",
    accent: "from-stone-100 to-zinc-50",
    songs: [
      "First Thing to Go",
      "My Limb",
      "Asystole",
      "Trigger",
      "Over Those Hills",
      "Good Grief",
      "Wait On",
      "KYRH",
      "Inordinary",
      "HYD",
      "No Use I Just Do",
      "Find Me Here",
      "Descansos",
      "Just A Lover",
    ],
  },

  {
    title: "EGO DEATH AT A BACHELORETTE PARTY",
    cover: "/img/ego-death-at-a-bachelorette-party.png",
    accent: "from-orange-100 to-pink-50",
    songs: [
      "Ice In My OJ",
      "Glum",
      "Kill Me",
      "Whim",
      "Mirtazapine",
      "Dissappearing Man",
      "Love Me Different",
      "Brotherly Hate",
      "Negative Self Talk",
      "Ego Death At A Bachelorette Party",
      "Hard",
      "Discovery Channel",
      "True Believer",
      "Zissou",
      "Dream Girl In Shibuya",
      "Blood Bros",
      "I Won't Quit On You",
      "Parachute",
      "Good Ol' Days",
      "Showbiz",
    ],
  },
];

const songDurations: Record<string, number> = {
  // PETALS FOR ARMOR
  "Simmer": 266,
  "Leave It Alone": 245,
  "Cinnamon": 211,
  "Creepin'": 178,
  "Sudden Desire": 187,
  "Dead Horse": 199,
  "My Friend": 219,
  "Over Yet": 214,
  "Why We Ever": 263,
  "Roses/Lotus/Violet/Iris": 321,
  "Pure Love": 187,
  "Taken": 165,
  "Sugar on the Rim": 254,
  "Watch Me While I Bloom": 224,
  "Crystal Clear": 212,

  // FLOWERS FOR VASES / DESCANSOS
  "First Thing to Go": 221,
  "My Limb": 186,
  "Asystole": 246,
  "Trigger": 215,
  "Over Those Hills": 206,
  "Good Grief": 238,
  "Wait On": 162,
  "KYRH": 214,
  "Inordinary": 250,
  "HYD": 209,
  "No Use I Just Do": 223,
  "Find Me Here": 233,
  "Descansos": 191,
  "Just A Lover": 307,

  // EGO DEATH AT A BACHELORETTE PARTY
  "Ice In My OJ": 131,
  "Glum": 191,
  "Kill Me": 167,
  "Whim": 215,
  "Mirtazapine": 201,
  "Disappearing Man": 209,
  "Love Me Different": 212,
  "Brotherly Hate": 169,
  "Negative Self Talk": 253,
  "Ego Death At A Bachelorette Party": 199,
  "Hard": 176,
  "Discovery Channel": 197,
  "True Believer": 229,
  "Zissou": 175,
  "Dream Girl In Shibuya": 262,
  "Blood Bros": 167,
  "I Won't Quit On You": 199,
  "Parachute": 220,
  "Good Ol' Days": 203,
  "Showbiz": 229,
};

function SortableSong({
  song,
  index,
}: {
  song: string;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <p
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`text-xl border-b border-white/30 pb-2 px-2 py-1 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 
        hover:bg-white/35 hover:backdrop-blur-sm hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] ${
        isDragging ? "opacity-50 scale-105" : ""
      }`}
    >
      {index + 1}. {song}
    </p>
  );
}

export default function Home() {
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [name, setName] = useState("");

  const posterRef = useRef<HTMLDivElement>(null);

  const toggleSong = (song: string) => {
    if (selectedSongs.includes(song)) {
      setSelectedSongs(selectedSongs.filter((s) => s !== song));
    } else {
      if (selectedSongs.length >= 20) return;
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSelectedSongs((songs) => {
      const oldIndex = songs.indexOf(active.id);
      const newIndex = songs.indexOf(over.id);

      return arrayMove(songs, oldIndex, newIndex);
    });
  };

  const downloadPoster = async () => {
    if (!posterRef.current) return;

    const dataUrl = await htmlToImage.toPng(posterRef.current, {
      pixelRatio: 2,
      backgroundColor: undefined,
    });

    const link = document.createElement("a");
    link.download = "hayley-setlist.png";
    link.href = dataUrl;
    link.click();
  };

  const totalSeconds = selectedSongs.reduce((acc, song) => {
    return acc + (songDurations[song] || 0);
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const formattedRuntime =
    hours > 0
      ? `${hours} h ${minutes} min`
      : `${minutes} min`;

  return (
    <main className="min-h-screen bg-white text-black p-10">
      <h1 className="text-5xl font-bold mb-2">
        THE HAYLEY WILLIAMS SHOW
      </h1>

      <div className="text-zinc-400 mb-6">
        <p>Armá tu setlist ideal, descargalo y compartilo!</p>
        <p>Create your ideal setlist, download it and share it!</p>
      </div>

      <input
        type="text"
        placeholder="@user..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded-lg mb-6 w-full max-w-sm"
      />

      <div className="mb-10 flex items-center justify-between">
        <p className="text-[#fd9abc] text-lg">
          {selectedSongs.length}/20 canciones seleccionadas
        </p>

        <button
          onClick={downloadPoster}
          className="bg-[#fd9abc] text-black px-6 py-3 rounded-xl font-bold"
        >
          Download Poster
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* LISTA */}
        <div className="space-y-10">
          {albums.map((album) => (
            <div key={album.title}>
              {/* HEADER DEL ALBUM */}
              <div
                className={`mb-5 rounded-3xl bg-gradient-to-r ${album.accent} p-4 border border-white/50 shadow-sm`}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={album.cover}
                    alt={album.title}
                    className="w-16 h-16 rounded-2xl object-cover shadow-md transition duration-300 hover:scale-105"
                  />

                  <div>
                    <h2 className="text-2xl font-black leading-tight">
                      {album.title}
                    </h2>

                    <p className="text-sm text-zinc-500">
                      {album.songs.length} tracks
                    </p>
                  </div>
                </div>
              </div>

              {/* SONGS */}
              <div className="grid grid-cols-2 gap-4">
                {album.songs.map((song) => (
                  <button
                    key={song}
                    onClick={() => toggleSong(song)}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      selectedSongs.includes(song)
                        ? "bg-[#fd9abc] text-black border-[#fd9abc] shadow-md scale-[1.02]"
                        : "bg-pink-50 border-pink-200 hover:border-[#fd9abc] hover:bg-pink-100 active:scale-95"
                    }`}
                  >
                    {song}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* POSTER FIX FINAL */}
        <div className="sticky top-10">
          <div
            ref={posterRef}
            className="relative rounded-3xl p-10 w-[1080px] min-h-[1350px] overflow-hidden"
          >
            {/* Fondo */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/img/fondo.png')" }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-white/40" />

            {/* CONTENIDO */}
            <div className="relative z-10">
              <p className="uppercase tracking-[0.3em] text-sm mb-3">
                setlist - <span className="font-semibold">{formattedRuntime}</span>
              </p>

              <h2 className="text-5xl font-black leading-none mb-2">
                THE HAYLEY WILLIAMS SHOW
              </h2>

              {name && (
                <p className="text-sm opacity-70 mb-8">
                  by {name}
                </p>
              )}

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedSongs}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {selectedSongs.map((song, index) => (
                      <SortableSong
                        key={song}
                        song={song}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <p className="mt-10 text-sm opacity-70">
                @ParamoreArgent
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}