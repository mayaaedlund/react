import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SERVER_URL = "http://localhost:5000";

function DocumentView() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const socket = useRef(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({}); // Håller kommentartexten för varje rad

    // Hämta användarnamn från sessionStorage när komponenten mountas
    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Fetch document on component mount or when `id` changes
    useEffect(() => {
        async function fetchDocument() {
            try {
                const response = await fetch(`http://localhost:5000/posts/${id}`);
                if (!response.ok) {
                    throw new Error('Dokumentet kunde inte hämtas');
                }
                const doc = await response.json();
                setDocument(doc);
                setContent(doc.content);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDocument();
    }, [id]);

    // Socket.IO setup and event listeners
    useEffect(() => {
        socket.current = io(SERVER_URL);
        socket.current.emit('create', id);

        socket.current.on("doc", (data) => {
            if (data._id === id) {
                setContent(data.content);
            }
        });

        return () => {
            socket.current.emit('leave', id);
            socket.current.disconnect();
        };
    }, [id]);

    function handleContentChange(e) {
        const newContent = e.target.value;
        setContent(newContent);
        socket.current.emit('doc', { _id: id, content: newContent });
    }
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const { title, content, email } = e.target.elements;

        try {
            const response = await fetch(`http://localhost:5000/posts/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: document._id,
                    title: title.value,
                    content: content.value,
                    email: email.value,
                }),
            });

            if (!response.ok) {
                throw new Error('Fel vid uppdatering av dokument');
            }
            navigate(`/editor`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Laddar dokument...</p>;
    if (error) return <p>Fel: {error}</p>;

    return (
        <div className="editor-container">
            <div className="document-container">
                <h1>Redigera Dokument</h1>
                <form onSubmit={handleUpdate}>
                    <input type="hidden" name="id" value={document._id} />
                    <label htmlFor="title">Titel</label>
                    <input
                        type="text"
                        className="form-input"
                        name="title"
                        defaultValue={document.title}
                        required
                    />
                    <label htmlFor="content">Innehåll</label>
                    <textarea
                        name="content"
                        className="text-area"
                        value={content}
                        onChange={handleContentChange}
                        required
                    ></textarea>
                    <label htmlFor="email">E-post</label>
                    <input
                        type="email"
                        className="form-input"
                        name="email"
                        defaultValue={document.email}
                        required
                    />
                    <input type="submit" value="Uppdatera" />
                </form>
            </div>

            <div className="comments-container">
                <h2>Kommentarer</h2>
                <div className="comments-view">
                    {content.split("\n").map((line, index) => (
                        <div key={index} className="line">
                            <div className="line-info">
                                <span className="line-number">{index + 1}</span>
                                <span>{line}</span>
                            </div>

                            <textarea
                                className='comment-input'
                                value={newComment[index + 1] || ''}
                                onChange={(e) => handleCommentChange(index + 1, e)}
                                placeholder="Skriv en kommentar"
                            />
                            <button
                                className="comments-button"
                                onClick={() => handleAddComment(index + 1)}
                                disabled={!newComment[index + 1]}
                            >
                                Lägg till kommentar
                            </button>

                            <div className="comments">
                                {(comments[index + 1] || []).map((comment, i) => (
                                    <p key={i} className="comment">
                                        <strong>{comment.user}:</strong> {comment.text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DocumentView;
