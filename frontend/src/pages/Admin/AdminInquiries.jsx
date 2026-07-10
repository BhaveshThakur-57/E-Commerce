import { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import Loader from "../../components/Loader";
import {
  getAllInquiriesAPI,
  replyToInquiryAPI,
  updateInquiryStatusAPI,
  deleteInquiryAPI,
} from "../../services/adminService";
import {
  MessageSquare, Mail, Clock, Send, Trash2, Eye,
  CheckCircle, XCircle, MailOpen, Reply, Filter,
  Search, AlertTriangle, ArrowLeft
} from "lucide-react";

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchInquiries = async () => {
    try {
      const data = await getAllInquiriesAPI();
      setInquiries(data);
    } catch (err) {
      console.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const handleReply = async () => {
    if (!reply.trim() || !selected) return;
    setReplying(true);
    try {
      const updated = await replyToInquiryAPI(selected._id, reply);
      setInquiries(inquiries.map((inq) => inq._id === updated._id ? updated : inq));
      setSelected(updated);
      setReply("");
    } catch (err) {
      console.error(err);
    } finally {
      setReplying(false);
    }
  };

  const handleClose = async (id) => {
    try {
      const updated = await updateInquiryStatusAPI(id, "closed");
      setInquiries(inquiries.map((inq) => inq._id === updated._id ? updated : inq));
      if (selected?._id === id) setSelected(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInquiryAPI(id);
      setInquiries(inquiries.filter((inq) => inq._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      console.error(err);
    }
  };

  const statusBadge = (status) => {
    const map = {
      new: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
      read: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
      replied: "bg-green-100 dark:bg-green-900/30 text-green-600",
      closed: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
    };
    return map[status] || map.new;
  };

  const statusIcon = (status) => {
    const map = {
      new: <Mail size={12} />,
      read: <MailOpen size={12} />,
      replied: <CheckCircle size={12} />,
      closed: <XCircle size={12} />,
    };
    return map[status] || map.new;
  };

  const filtered = inquiries.filter((inq) => {
    const matchFilter = filter === "all" || inq.status === filter;
    const matchSearch = search === "" ||
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      inq.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const newCount = inquiries.filter((i) => i.status === "new").length;

  if (loading) return <div className="pt-28"><Loader text="Loading inquiries..." /></div>;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold flex items-center gap-3">
              Inquiries
              {newCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-500">
                  {newCount} new
                </span>
              )}
            </h1>
            <p className="text-zinc-500 text-sm">Manage customer messages and support requests</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or subject..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "new", "read", "replied", "closed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  filter === f
                    ? "bg-brand-500 text-white"
                    : "bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:border-brand-400/30"
                }`}
              >
                {f === "all" ? `All (${inquiries.length})` : `${f} (${inquiries.filter(i => i.status === f).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Layout: List + Detail */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Inquiry List */}
          <div className={`lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1 ${selected ? "hidden lg:block" : "block"}`}>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No inquiries found</p>
              </div>
            ) : (
              filtered.map((inq) => (
                <div
                  key={inq._id}
                  onClick={() => setSelected(inq)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    selected?._id === inq._id
                      ? "border-brand-500 bg-brand-500/5 shadow-lg shadow-brand-500/10"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-brand-400/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{inq.name}</p>
                      <p className="text-xs text-zinc-400 truncate">{inq.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize flex items-center gap-1 ${statusBadge(inq.status)}`}>
                      {statusIcon(inq.status)} {inq.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">{inq.subject}</p>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{inq.message}</p>
                  <p className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1">
                    <Clock size={10} /> {new Date(inq.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className={`lg:col-span-3 ${!selected ? "hidden lg:block" : "block"}`}>
            {!selected ? (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-12 text-center">
                <Eye size={48} className="mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                <p className="text-zinc-400 text-sm">Select an inquiry to view details</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setSelected(null)}
                      className="lg:hidden mt-1 p-2 -ml-2 text-zinc-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h2 className="font-display text-xl font-bold">{selected.subject}</h2>
                    <p className="text-sm text-zinc-500 mt-1">
                      From <span className="font-medium text-zinc-700 dark:text-zinc-300">{selected.name}</span> ({selected.email})
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                      <Clock size={12} /> {new Date(selected.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleClose(selected._id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all"
                      title="Close inquiry"
                    >
                      <XCircle size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(selected._id)}
                      className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      title="Delete inquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Customer Message */}
                <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mb-6">
                  <p className="text-xs font-semibold text-zinc-400 mb-2">Customer Message:</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{selected.message}</p>
                </div>

                {/* Admin Reply (if exists) */}
                {selected.adminReply && (
                  <div className="p-5 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 mb-6">
                    <p className="text-xs font-semibold text-green-600 mb-2 flex items-center gap-1">
                      <CheckCircle size={12} /> Your Reply (sent {selected.repliedAt ? new Date(selected.repliedAt).toLocaleString("en-IN") : ""})
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 whitespace-pre-wrap">{selected.adminReply}</p>
                  </div>
                )}

                {/* Reply Box */}
                {selected.status !== "closed" && (
                  <div>
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 block flex items-center gap-1">
                      <Reply size={12} /> {selected.adminReply ? "Update Reply" : "Write Reply"}
                    </label>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      placeholder="Type your reply... (will be emailed to customer)"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-brand-500 transition-all resize-none"
                    />
                    <button
                      onClick={handleReply}
                      disabled={replying || !reply.trim()}
                      className="btn-primary mt-3 flex items-center gap-2"
                    >
                      <Send size={16} /> {replying ? "Sending..." : "Send Reply"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminInquiries;
