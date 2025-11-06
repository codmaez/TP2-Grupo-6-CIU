import { useEffect, useState } from "react";
import Post from "../components/Post";
import type { PostType } from "../components/Post";
import { Link } from "react-router-dom";
import "./css/homePage.css";

interface Tag {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});

  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/posts");
      if (!res.ok) throw new Error(`Error al obtener publicaciones (${res.status})`);
      const data: PostType[] = await res.json();
      data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(data);
      await fetchCommentCounts(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Error desconocido al cargar publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  const getTags = async () => {
    try {
      const res = await fetch("http://localhost:3001/tags");
      if (!res.ok) throw new Error("No se pudieron cargar las etiquetas");
      const data: Tag[] = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Error al cargar etiquetas:", err);
    }
  };

  const fetchCommentCounts = async (postsList: PostType[]) => {
    try {
      const promises = postsList.map(async (p) => {
        try {
          const res = await fetch(`http://localhost:3001/comments/post/${p.id}`);
          if (!res.ok) return { id: p.id, count: 0 };
          const comments = await res.json();
          return { id: p.id, count: Array.isArray(comments) ? comments.length : 0 };
        } catch {
          return { id: p.id, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      const map: Record<number, number> = {};
      results.forEach((r) => (map[r.id] = r.count));
      setCommentCounts(map);
    } catch (err) {
      console.error("Error al obtener cantidad de comentarios:", err);
    }
  };

  useEffect(() => {
    getTags();
    getPosts();
  }, []);

  const filteredPosts = selectedTagId
    ? posts.filter(
        (p) => Array.isArray(p.Tags) && p.Tags.some((t) => t.id === selectedTagId)
      )
    : posts;

  return (
    <div className="container py-4 px-3 px-md-5">
      {/* 🔹 Banner principal */}
      <div className="mb-4 text-center">
        <div
          className="p-4 rounded-4 shadow-sm text-white"
          style={{
            background: "linear-gradient(135deg,#6f42c1,#20c997)",
          }}
        >
          <h1 className="fw-bold mb-2 display-6">UnaHur Anti-Social Net</h1>
          <p className="mb-0 fs-5 opacity-90">
            Publicá lo que quieras (o no). Conectá con quien prefieras evitar.
          </p>
          <small className="d-block mt-2 opacity-75">
            Navegá las últimas publicaciones, comentá y compartí tu antipatía.
          </small>
        </div>
      </div>

      {/* 🔹 Filtros de etiquetas */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
          <button
            className={`btn btn-sm rounded-pill px-3 ${
              selectedTagId === null
                ? "btn-primary"
                : "btn-outline-primary border-2"
            }`}
            onClick={() => setSelectedTagId(null)}
          >
            Todas
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={`btn btn-sm rounded-pill px-3 ${
                selectedTagId === tag.id
                  ? "btn-primary"
                  : "btn-outline-primary border-2"
              }`}
              onClick={() =>
                setSelectedTagId(selectedTagId === tag.id ? null : tag.id)
              }
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="text-center text-md-end">
          <Link to="/perfil" className="btn btn-outline-secondary btn-sm rounded-pill">
            <i className="bi bi-person-circle me-1"></i> Mi perfil
          </Link>
        </div>
      </div>

      {/* 🔹 Feed */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" aria-hidden="true" />
          <div className="mt-2 text-muted">Cargando publicaciones...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="alert alert-info text-center">
          No hay publicaciones para mostrar.
        </div>
      ) : (
        <div className="mx-auto" style={{ maxWidth: "850px" }}>
          {filteredPosts.map((post) => (
            <div key={post.id} className="mb-4 shadow-sm rounded-4 p-3 bg-white">
              <Post post={post} />
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted small">
                  {typeof commentCounts[post.id] === "number"
                    ? `${commentCounts[post.id]} comentario${
                        commentCounts[post.id] === 1 ? "" : "s"
                      } visibles`
                    : "Comentarios: -"}
                </div>
                <Link
                  to={`/post/${post.id}`}
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                >
                  Ver más
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Footer */}
      <footer className="mt-5 text-center text-muted small py-3 border-top">
        <p className="mb-0">
          <b>UnaHur Anti-Social Net</b> — la red donde la gente se conecta sin tanto contacto.
        </p>
        <p className="mb-0">
          Proyecto académico — <b>Construcción de Interfaces de Usuario</b>
        </p>
      </footer>
    </div>
  );
}
