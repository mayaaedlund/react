import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SERVER_URL = "http://localhost:5000";

function DocumentView() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const socket = useRef(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState({});


    // Fetch document on component mount or when `id` changes
    useEffect(() => {
        async function fetchDocument() {
            try {
                console.log(`Fetching document with ID: ${id}`);
                const response = await fetch(`http://localhost:5000/posts/${id}`);
                if (!response.ok) {
                    throw new Error('Dokumentet kunde inte hämtas');
                }
                const doc = await response.json();
                console.log("Document fetched:", doc);
                setDocument(doc);
                setContent(doc.content);
            } catch (err) {
                console.error("Error fetching document:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchDocument();
    }, [id]);

    // Socket.IO setup and event listeners
    useEffect(() => {
        console.log("Initializing socket connection...");
        socket.current = io(SERVER_URL);

        // Join the room for this specific document
        socket.current.emit('create', id);

        // Listen for document updates from other clients
        socket.current.on("doc", (data) => {
            console.log("Received 'doc' event:", data);
            if (data._id === id) {
                setContent(data.content);
            }
        });

        return () => {
            console.log(`Leaving room with ID: ${id}`);
            socket.current.emit('leave', id);
            socket.current.disconnect();
            console.log("Socket disconnected");
        };
    }, [id]);

    function handleContentChange(e) {
        const newContent = e.target.value;
        setContent(newContent);
        console.log("Emitting 'doc' event:", { _id: id, content: newContent });
        socket.current.emit('doc', { _id: id, content: newContent });
    }

    // Lyssna på kommentarer från andra användare via Socket.IO
    useEffect(() => {
        socket.current.on("comment", (data) => {
            setComments((prev) => ({
                ...prev,
                [data.line]: [...(prev[data.line] || []), data.comment],
            }));
        });
    }, []);

    // Skicka kommentar till servern
    function handleAddComment(line, commentText) {
        const newComment = { line, comment: commentText };
        setComments((prev) => ({
            ...prev,
            [line]: [...(prev[line] || []), commentText],
        }));
        socket.current.emit("comment", newComment);

        // Skicka kommentar till servern för att spara i databasen
        fetch(`/api/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ line, comment: commentText }),
        });
    }


    

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { title, content, email } = e.target.elements;

        try {
            console.log("Updating document...");
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

            

            console.log("Document updated successfully.");
            navigate(`/editor`);
        } catch (err) {
            console.error("Error updating document:", err.message);
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
                            <button
                                className='comments-button'
                                onClick={() =>
                                    handleAddComment(index + 1, prompt("Ange kommentar:"))
                                }
                            >
                                Lägg till kommentar
                            </button>
                            <div className="comments">
                                {(comments[index + 1] || []).map((comment, i) => (
                                    <p key={i} className="comment">{comment}</p>
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
