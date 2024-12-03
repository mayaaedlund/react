import { useState, useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function TextEditor() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [documents, setDocuments] = useState([]);
    //const navigate = useNavigate();


    // Hämta användarnamn från sessionStorage när komponenten mountas
    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                // Kontrollera om användarnamnet finns i sessionStorage
                const storedUsername = sessionStorage.getItem('username');
                if (!storedUsername) {
                    console.error('Ingen användare är inloggad');
                    return;
                }
    
                const response = await fetch(`http://localhost:5000/posts`);
                if (response.ok) {
                    const docs = await response.json();
                    setDocuments(docs);

                    console.log('Alla dokument:', docs);
                } else {
                    console.error('Error fetching documents:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    
        fetchDocuments();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:5000/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    username,
                    email,
                }),
            });
    
            if (response.ok) {
                const newDoc = await response.json();
                setDocuments((prevDocs) => [
                    ...prevDocs,
                    {
                        id: newDoc.insertedId,
                        title,
                        content,
                        username,
                        email,
                    },
                ]);
    
                try {
                    console.log('Skickar e-post till:', email, 'med titel:', title);
                
                    const emailResponse = await fetch('http://localhost:5000/posts/email', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email, 
                            title,
                        }),
                    });
                
                    if (emailResponse.ok) {
                        console.log('Inbjudan skickad!');
                    } else {
                        // Läs svaret från servern om det finns ett meddelande eller felkod
                        const errorResponse = await emailResponse.json();
                        console.error('Fel vid sändning av inbjudan:', errorResponse.message || errorResponse.error || 'Okänt fel');
                    }
                } catch (err) {
                    console.error("Ett fel inträffade vid e-postsändning:", err);
                }
                
                
    
                // Återställ formuläret
                setTitle("");
                setContent("");
                setEmail("");
            } else {
                console.error('Error saving document:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <>
            <div className='text-editor'>
                <div>
                <h1>Textredigerare</h1>
                <p className="user-info">Inloggad som {username}</p>

                    <form className='text-form' onSubmit={handleSubmit}>

                        <label htmlFor="title">Titel</label>
                        <input
                            type="text"
                            className='form-input'
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <label htmlFor="content">Innehåll</label>
                        <textarea
                            id="content"
                            className='text-area'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>

                        <label htmlFor="email">Access (E-post)</label>
                        <input
                            type="email"
                            className='form-input'
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="user-info">Skriv in en mailadress som du vill ska få access till dokumentet.</p>

                        <button type="submit" className="submit-btn">Spara</button>
                    </form>
                </div>

                <div>
                    <h1 className='document-font'>Dina dokument:</h1>
                    {documents.length > 0 ? (
                        <ul className="document-list">
                        {documents
                            .filter((doc) => doc.owner === username || doc.access === username)
                            .map((doc) => (
                            <li key={doc._id} className="document-item">
                                <h2>{doc.title}</h2>
                                <p className='owner'>Skapare: {doc.owner}</p>
                                <p className='owner'>Medredigerare: {doc.access}</p>
                                <Link to={`/documents/${doc._id}`} className="view-link">
                                Öppna dokument
                                </Link>
                            </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Inga dokument hittades.</p>
                    )}
                    </div>

            </div>
        </>
    );
}

export default TextEditor;
