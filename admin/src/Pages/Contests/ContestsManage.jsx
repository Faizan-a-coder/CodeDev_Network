import React, { useState, useEffect, useContext } from 'react';
import { getAllContests, deleteContest, createContest, updateContest } from '../../api/admin.api';
import { Context } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import '../Manage.css';

export default function ContestsManage() {
  const { url, token } = useContext(Context);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  
  // Date values for input fields need to be styled "YYYY-MM-DDTHH:mm" for datetime-local
  const [formData, setFormData] = useState({
    id: '', title: '', slug: '', startTime: '', endTime: '', problemsJson: '[]'
  });

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const res = await getAllContests(url, token);
      if (res.data.success) {
        setContests(res.data.contests);
      }
    } catch (error) {
      toast.error("Failed to fetch contests");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;
    try {
      const res = await deleteContest(url, token, id);
      if (res.data.success) {
        toast.success("Contest deleted successfully!");
        fetchContests();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete contest");
    }
  };

  const toInputDateStr = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const pad = (num) => String(num).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setFormData({ id: '', title: '', slug: '', startTime: '', endTime: '', problemsJson: '[]' });
    setShowModal(true);
  };

  const openEditModal = (contest) => {
    setIsEdit(true);
    // Note: contest object might not contain .problems due to select("-problems")
    // If not, editing problems requires fetching them individually or ignoring it for now.
    // For MVPs, we assume we might simply preserve existing problems on backend if problems is undefined inside body.
    setFormData({
      id: contest._id,
      title: contest.title || '',
      slug: contest.slug || '',
      startTime: toInputDateStr(contest.startTime),
      endTime: toInputDateStr(contest.endTime),
      problemsJson: '[]' // Since we excluded it in fetch, editing problems is unsupported visually unless fetched
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parsedProblems = [];
      try {
        parsedProblems = JSON.parse(formData.problemsJson);
      } catch (err) {
        return toast.error("Invalid JSON format for Problems");
      }

      if (!isEdit && parsedProblems.length === 0) {
          return toast.error("At least one problem is required to create a contest.");
      }

      const submitData = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString()
      };

      // Only attach problems if we actually provided them (allows bypass on edits if excluded)
      if (parsedProblems.length > 0) {
          submitData.problems = parsedProblems;
      }

      if (isEdit) {
        const res = await updateContest(url, token, formData.id, submitData);
        if (res.data.success) toast.success("Contest updated!");
      } else {
        const res = await createContest(url, token, submitData);
        if (res.data.success) toast.success("Contest created!");
      }
      setShowModal(false);
      fetchContests();
    } catch (error) {
      toast.error(error?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} contest`);
    }
  };

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>Manage Contests</h2>
        <button className="primary-btn" onClick={openCreateModal}>+ Add Contest</button>
      </div>

      {loading ? (
        <p>Loading contests...</p>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id}>
                  <td>{contest.title}</td>
                  <td>
                    <span className={`badge ${contest.status === 'upcoming' ? 'admin' : 'user'}`}>
                      {contest.status}
                    </span>
                  </td>
                  <td>{new Date(contest.startTime).toLocaleString()}</td>
                  <td>{new Date(contest.endTime).toLocaleString()}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => openEditModal(contest)}>Edit</button>
                    <button className="action-btn delete" onClick={() => handleDelete(contest._id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {contests.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No contests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEdit ? 'Edit Contest' : 'Create Contest'}</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
              </div>
              <div className="form-group">
                <label>Slug (Unique URL identifier)</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleFormChange} placeholder="e.g. weekly-contest-1 (auto-generated if empty)" />
              </div>
              
              <div className="form-group">
                <label>Start Time</label>
                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleFormChange} required />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleFormChange} required />
              </div>
              
              <div className="form-group">
                <label>Problems (Valid JSON Array)</label>
                {!isEdit && <p style={{fontSize: '11px', color: '#888', marginBottom: '4px'}}>Mandatory for creation.</p>}
                <textarea 
                  rows="4" 
                  name="problemsJson" 
                  value={formData.problemsJson} 
                  onChange={handleFormChange} 
                  placeholder='[{"problemId":"<id-here>","order":1,"points":100}]'
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="primary-btn">{isEdit ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
