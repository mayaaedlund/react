// DocumentList.js
import React from 'react';
import { Link } from 'react-router-dom';

function DocumentList({ documents, username }) {
    const userDocuments = documents.filter(
        (doc) => doc.owner === username || doc.access === username
    );

    return (
        <div>
            <h1>Dina dokument:</h1>
            {userDocuments.length > 0 ? (
                <ul className="document-list">
                    {userDocuments.map((doc) => (
                        <li key={doc._id} className="document-item">
                            <h2>{doc.title}</h2>
                            <p>Skapare: {doc.owner}</p>
                            <p>Medredigerare: {doc.access}</p>
                            <Link to={`/documents/${doc._id}`}>Öppna dokument</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Inga dokument hittades.</p>
            )}
        </div>
    );
}

export default DocumentList;
