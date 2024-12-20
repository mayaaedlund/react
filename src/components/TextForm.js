// TextForm.js
import React, { useState } from 'react';

function TextForm({ username, addDocument }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Skicka dokumentdata till servern
            const response = await fetch('https://jsramverk-mayaed-d6arardta3fwd4ae.northeurope-01.azurewebsites.net/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, username, email }),
            });
    
            if (response.ok) {
                const newDoc = await response.json();
    
                // Skicka e-post
                await fetch('https://jsramverk-mayaed-d6arardta3fwd4ae.northeurope-01.azurewebsites.net/posts/email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, title }),
                });
    
                addDocument({ id: newDoc.insertedId, title, content, username, email });
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
        <form className="text-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Titel</label>
            <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <label htmlFor="content">Innehåll</label>
            <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            ></textarea>

            <label htmlFor="email">Access (E-post)</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Spara</button>
        </form>
    );
}

export default TextForm;
