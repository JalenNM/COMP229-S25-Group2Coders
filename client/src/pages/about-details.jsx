import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AboutDetail = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ education: "", contact: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("유저 정보를 불러오지 못했습니다.");
        const data = await res.json();
        setUser(data);
        setForm({ education: data.education || "", contact: data.contact || "" });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("정보 수정에 실패했습니다.");
      navigate("/about"); // 수정 완료 후 조회 페이지로 이동
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>프로필 수정</h2>
      <div className="alert alert-warning" role="alert">
        수정은 학력 연락처만 허용됩니다.
      </div>
      <form onSubmit={handleSubmit}>
        {/* 읽기 전용 필드 */}
        <div className="mb-3">
          <label>Username</label>
          <input type="text" className="form-control" value={user.username} readOnly />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={user.email} readOnly />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <input type="text" className="form-control" value={user.role} readOnly />
        </div>

        {/* 수정 가능한 필드 */}
        <div className="mb-3">
          <label>학력</label>
          <input
            type="text"
            name="education"
            value={form.education}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>연락처</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">저장</button>
      </form>
    </div>
  );
};

export default AboutDetail;
