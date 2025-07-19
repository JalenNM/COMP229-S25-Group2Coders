import { useState } from "react";

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for contacting us, " + form.name + "!");
        setForm({ name: "", email: "", message: "" });
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Name:</label><br />
                    <input type="text" name="name" value={form.name} onChange={handleChange} required style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Email:</label><br />
                    <input type="email" name="email" value={form.email} onChange={handleChange} required style={{ width: "100%" }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Message:</label><br />
                    <textarea name="message" value={form.message} onChange={handleChange} required style={{ width: "100%" }} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}