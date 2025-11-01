import { useEffect, useState } from "react";
import Post from "../components/Post";
import type { PostType } from "../components/Post";
import { Link } from "react-router-dom";

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

  // 🔹 Traer todas las publicaciones
  const getPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3001/posts");
      if (!res.ok) throw new Error(`Error al obtener publicaciones (${res.status})`);
      const data: PostType[] = await res.json();
      // Ordenar por fecha descendente
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

  // 🔹 Traer todas las etiquetas
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

  // 🔹 Contar comentarios visibles por publicación
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

  // 🔹 Filtrar publicaciones por etiqueta seleccionada
  const filteredPosts = selectedTagId
    ? posts.filter(
        (p) => Array.isArray(p.Tags) && p.Tags.some((t) => t.id === selectedTagId)
      )
    : posts;

  return (
    <div className="container my-4">
      {/* 🔹 Banner principal */}
      <div className="row mb-4">
        <div className="col-12">
          <div
            className="p-4 rounded shadow text-white"
            style={{
              background: "linear-gradient(135deg,#6f42c1,#20c997)",
            }}
          >
            <h1 className="mb-1">UnaHur Anti-Social Net</h1>
            <p className="mb-0">
              Publicá lo que quieras (o no). Conectá con quien prefieras evitar.
            </p>
            <small className="d-block mt-2">
              Navegá las últimas publicaciones, comentá y compartí tu antipatía.
            </small>
          </div>
        </div>
      </div>

      {/* 🔹 Filtros de etiquetas */}
      <div className="row mb-3 align-items-center">
        <div className="col-md-6 mb-2 mb-md-0">
          <div className="d-flex gap-2 flex-wrap">
            <button
              className={`btn btn-sm ${
                selectedTagId === null ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setSelectedTagId(null)}
            >
              Todas
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                className={`btn btn-sm ${
                  selectedTagId === tag.id ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() =>
                  setSelectedTagId(selectedTagId === tag.id ? null : tag.id)
                }
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-6 text-md-end">
          <Link
            to="/perfil"
            className="btn btn-outline-secondary btn-sm me-2"
          >
            Mi perfil
          </Link>
          <Link to="/crear" className="btn btn-primary btn-sm">
            Crear publicación
          </Link>
        </div>
      </div>

      {/* 🔹 Feed de publicaciones */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" aria-hidden="true" />
          <div className="mt-2">Cargando publicaciones...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="alert alert-info">No hay publicaciones para mostrar.</div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column">
              {filteredPosts.map((post) => (
                <div key={post.id} className="mb-3">
                  <Post post={post} />
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div className="text-muted small">
                      {typeof commentCounts[post.id] === "number"
                        ? `${commentCounts[post.id]} comentario${
                            commentCounts[post.id] === 1 ? "" : "s"
                          } visibles`
                        : "Comentarios: -"}
                    </div>
                    <Link
                      to={`/post/${post.id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Footer */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="p-3 rounded border">
            <h5>Sobre nosotros</h5>
            <p className="mb-0">
              UnaHur Anti-Social Net — la red donde la gente se conecta sin tanto contacto.  
              Proyecto académico de la materia <b>Construcción de Interfaces de Usuario</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
