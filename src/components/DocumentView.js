import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SERVER_URL = "https://jsramverk-mayaed-d6arardta3fwd4ae.northeurope-01.azurewebsites.net/";

function DocumentView() {
    const { id } = useParams();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const socket = useRef(null);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    // Fetch username from sessionStorage
    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    // Fetch document and comments
    useEffect(() => {
        async function fetchDocument() {
            try {
                const response = await fetch(`https://jsramverk-mayaed-d6arardta3fwd4ae.northeurope-01.azurewebsites.net/posts/${id}`);
                if (!response.ok) {
                    throw new Error('Document could not be fetched');
                }
                const doc = await response.json();
                setDocument(doc);
                setContent(doc.content);
                setComments(doc.comments || []);
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

        socket.current.on("comment", (comment) => {
            if (comment._id === id) {
                setComments(prevComments => [...prevComments, comment]);
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

    function handleCommentChange(e) {
        setNewComment(e.target.value);
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        const comment = { _id: id, text: newComment, username: username };
        socket.current.emit('comment', comment);
        setComments(prevComments => [...prevComments, comment]);
        setNewComment('');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const { title, content, email } = e.target.elements;

        try {
            const response = await fetch(`https://jsramverk-mayaed-d6arardta3fwd4ae.northeurope-01.azurewebsites.net/posts/update`, {
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
                throw new Error('Error updating document');
            }
            navigate(`/editor`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading document...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="document-view">
            <div className="editor-container">
                <div className="editor">
                    <h1>Update Document</h1>
                    <form className="text-form" onSubmit={handleUpdate}>
                        <input 
                            type="hidden"
                            name="id"
                            value={document._id} />
                        
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-input" name="title" defaultValue={document.title} required />

                        <label htmlFor="content">Content</label>
                        <textarea 
                            name="content"
                            className="text-area"
                            value={content}
                            onChange={handleContentChange}
                            required
                        ></textarea>

                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            name="email"
                            defaultValue={document.email}
                        />

                        <input type="submit" value="Update" />
                    </form>
                </div>

                <div className="comments">
                    <h2>Comments</h2>
                    <div className="comments-list">
                        {comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p><strong>{comment.username}:</strong> {comment.text}</p>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddComment}>
                        <textarea 
                            value={newComment}
                            onChange={handleCommentChange}
                            placeholder="Write a comment..."
                            required
                        />
                        <button type="submit">Add Comment</button>
                    </form>
                </div>
            </div>
            <p>Email with access to this: {document.access}</p>
        </div>
    );
}

export default DocumentView;
