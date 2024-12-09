// TextEditor.js
import React, { useState, useEffect } from 'react';
import DocumentList from './DocumentList';
import TextForm from './TextForm';

function TextEditor() {
    const [username, setUsername] = useState("");
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) setUsername(storedUsername);
    }, []);

    useEffect(() => {
        async function fetchDocuments() {
            try {
                const response = await fetch(`http://localhost:5000/posts`);
                if (response.ok) {
                    const docs = await response.json();
                    setDocuments(docs);
                } else {
                    console.error('Error fetching documents:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        fetchDocuments();
    }, []);

    const addDocument = (newDoc) => setDocuments((prev) => [...prev, newDoc]);

    return (
        <div className="text-editor">
            <h1>Textredigerare</h1>
            <p className="user-info">Inloggad som {username}</p>
            <TextForm username={username} addDocument={addDocument} />
            <DocumentList documents={documents} username={username} />
        </div>
    );
}

export default TextEditor;
