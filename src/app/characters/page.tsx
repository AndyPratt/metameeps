"use client";

import { useState } from "react";
import Link from "next/link";
import { characters } from "@/lib/mock-data";
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Clock,
  User,
  Tag,
  BookOpen,
  Copy,
} from "lucide-react";

export default function CharactersPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filterProduct, setFilterProduct] = useState<string>("all");
  const [filterOwner, setFilterOwner] = useState<"all" | "mine" | "team">("all");
  const [searchOpen, setSearchOpen] = useState(false);

  const currentUser = "Andy Pratt";

  const filtered = characters.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.identity.toLowerCase().includes(search.toLowerCase());
    const matchesProduct =
      filterProduct === "all" ||
      c.configurations.some((cfg) => cfg.product === filterProduct);
    const matchesOwner =
      filterOwner === "all" ||
      (filterOwner === "mine" && c.createdBy === currentUser) ||
      (filterOwner === "team" && c.createdBy !== currentUser);
    return matchesSearch && matchesProduct && matchesOwner;
  });

  const allProducts = Array.from(
    new Set(characters.flatMap((c) => c.configurations.map((cfg) => cfg.product)))
  );

  return (
    <div className="px-4 sm:px-6 md:px-8 pt-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Characters</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filtered.length} of {characters.length} characters
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Character
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {([
            { id: "all" as const, label: "All" },
            { id: "mine" as const, label: "My Characters" },
            { id: "team" as const, label: "Team" },
          ]).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterOwner(f.id)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filterOwner === f.id ? "bg-white shadow-sm text-foreground font-medium" : "text-muted-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {searchOpen ? (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search characters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setSearchOpen(false); }}
              autoFocus
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        <select
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="px-3 py-2 bg-muted rounded-lg text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="all">All Products</option>
          {allProducts.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <div className="flex items-center bg-muted rounded-lg p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              className="group border border-border rounded-xl p-5 hover:border-accent/30 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-lg font-semibold text-accent shrink-0">
                  {character.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                    {character.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">v{character.version}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      character.status === "published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                    }`}>
                      {character.status}
                    </span>
                    {character.clonedFrom && <span className="text-xs text-muted-foreground italic">cloned</span>}
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {character.identity}
              </p>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {character.configurations[0] ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md text-[11px] font-medium text-muted-foreground">
                    <Tag className="w-3 h-3" />
                    {character.configurations[0].product} &middot; {character.configurations[0].platform}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground italic">No product assigned</span>
                )}
                {character.scenes.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 rounded-md text-[11px] font-medium text-accent">
                    <BookOpen className="w-3 h-3" />
                    {character.scenes.length} {character.scenes.length === 1 ? "scene" : "scenes"} &middot; {character.scenes.reduce((sum, s) => sum + s.chapters.length, 0)} chapters
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {character.createdBy}
                </span>
                <div className="flex items-center gap-2">
                  {character.createdBy !== currentUser && character.status === "published" && (
                    <button
                      onClick={(e) => { e.preventDefault(); }}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-muted text-muted-foreground hover:text-accent transition-colors"
                      title="Clone to my drafts"
                    >
                      <Copy className="w-3 h-3" />
                      Clone
                    </button>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(character.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-muted text-left">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Character</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Scenes</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Version</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Created By</th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((character) => (
                <tr key={character.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/characters/${character.id}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-sm font-semibold text-accent">
                        {character.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground hover:text-accent">{character.name}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{character.identity}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {character.configurations[0] ? (
                        <span className="px-2 py-0.5 bg-muted rounded text-[11px] font-medium text-muted-foreground">
                          {character.configurations[0].product} &middot; {character.configurations[0].platform}
                        </span>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {character.scenes.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-medium">
                        <BookOpen className="w-3 h-3" />
                        {character.scenes.reduce((sum, s) => sum + s.chapters.length, 0)} ch
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">v{character.version}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{character.createdBy}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(character.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
