import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Badge } from "../components/ui/Badge";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { 
  Plus, 
  Briefcase, 
  Star, 
  Trash2,
  ChevronDown,
  UserCheck,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  X,
  Building,
  CheckCircle2
} from "lucide-react";

const COLUMNS = [
  { 
    id: "applied", 
    title: "Mới Nộp", 
    subTitle: "Applied", 
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    accentColor: "border-t-slate-500" 
  },
  { 
    id: "screening", 
    title: "Sơ Loại Hồ Sơ", 
    subTitle: "Screening", 
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    accentColor: "border-t-amber-500" 
  },
  { 
    id: "interview", 
    title: "Phỏng Vấn", 
    subTitle: "Interview", 
    badgeColor: "bg-teal-100 text-teal-900 border-teal-200",
    accentColor: "border-t-teal-600" 
  },
  { 
    id: "accepted", 
    title: "Gửi Đề Nghị", 
    subTitle: "Offer Letter", 
    badgeColor: "bg-sky-100 text-sky-900 border-sky-200",
    accentColor: "border-t-sky-500" 
  },
  { 
    id: "hired", 
    title: "Đã Tuyển Dụng", 
    subTitle: "Hired", 
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    accentColor: "border-t-emerald-600" 
  },
  { 
    id: "rejected", 
    title: "Không Phù Hợp", 
    subTitle: "Rejected", 
    badgeColor: "bg-rose-100 text-rose-900 border-rose-200",
    accentColor: "border-t-rose-400" 
  }
];

const Applications = ({ onNavigate }) => {
  const [applications, setApplications] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Modal tạo hồ sơ mới
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    candidateId: "",
    positionId: "",
    source: "Website",
    score: 80,
    note: ""
  });

  // Modal chuyển sang nhân viên chính thức
  const [convertModal, setConvertModal] = useState({
    isOpen: false,
    app: null,
    salary: 25000000,
    startDate: new Date().toISOString().split("T")[0]
  });

  // Confirm delete
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: null,
    name: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, candRes, posRes] = await Promise.all([
        api.getApplications({ positionId: selectedPosition || undefined }),
        api.getCandidates(),
        api.getPositions()
      ]);
      if (appRes.success) setApplications(appRes.data);
      if (candRes.success) setCandidates(candRes.data);
      if (posRes.success) setPositions(posRes.data);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPosition]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.updateApplicationStatus(appId, { status: newStatus });
      if (res.success) {
        if (res.headcountInfo?.isFull && newStatus === 'hired') {
          toast.success(
            `Thông báo: Đã tuyển đủ chỉ tiêu (${res.headcountInfo.hiredCount}/${res.headcountInfo.quantity}) cho vị trí "${res.headcountInfo.positionTitle}". Vị trí đã được tự động đóng.`
          );
        } else {
          toast.success("Đã chuyển trạng thái sang: " + newStatus);
        }
        fetchData();
      }
    } catch (err) {
      toast.error("Lỗi cập nhật trạng thái: " + err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createApplication(formData);
      if (res.success) {
        toast.success("Tạo đơn ứng tuyển thành công!");
        setIsOpenModal(false);
        setFormData({
          candidateId: "",
          positionId: "",
          source: "Website",
          score: 80,
          note: ""
        });
        fetchData();
      }
    } catch (err) {
      toast.error("Lỗi tạo hồ sơ: " + err.message);
    }
  };

  const handleOpenConvert = (app) => {
    setConvertModal({
      isOpen: true,
      app,
      salary: app.positionId?.salaryMax || 25000000,
      startDate: new Date().toISOString().split("T")[0]
    });
  };

  const handleConfirmConvert = async (e) => {
    e.preventDefault();
    const app = convertModal.app;
    if (!app) return;

    try {
      const res = await api.convertCandidateToEmployee({
        candidateId: app.candidateId._id,
        positionId: app.positionId._id,
        departmentId: app.positionId.departmentId?._id || app.positionId.departmentId,
        officialSalary: Number(convertModal.salary),
        startDate: new Date(convertModal.startDate)
      });

      if (res.success) {
        toast.success("Chúc mừng! Đã chuyển đổi thành nhân viên chính thức.");
        setConvertModal({ isOpen: false, app: null, salary: 25000000, startDate: "" });
        fetchData();
      }
    } catch (err) {
      toast.error("Lỗi chuyển đổi: " + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteApplication(deleteConfirm.id);
      toast.success("Đã xóa đơn ứng tuyển");
      setDeleteConfirm({ isOpen: false, id: null, name: "" });
      fetchData();
    } catch (err) {
      toast.error("Lỗi khi xóa: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Quy Trình Tuyển Dụng (Kanban)</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Lọc vị trí */}
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 shadow-2xs cursor-pointer"
          >
            <option value="">Tất cả vị trí việc làm</option>
            {positions.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.departmentId?.name || "Phòng ban"})
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsOpenModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs shadow-indigo-600/20 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Nộp Hồ Sơ Mới
          </button>
        </div>
      </div>

      {/* 6 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {COLUMNS.map((col, colIdx) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className={"bg-slate-100/70 p-3 rounded-2xl border border-slate-200/80 flex flex-col min-h-[500px] border-t-4 " + col.accentColor}
            >
              {/* Cột Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-3 px-1">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 leading-tight">{col.title}</h3>
                  <span className="text-[10px] text-slate-400 font-medium">{col.subTitle}</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-white text-slate-700 font-bold text-[10px] flex items-center justify-center border border-slate-200 shadow-2xs">
                  {colApps.length}
                </span>
              </div>

              {/* Danh sách Cards */}
              <div className="flex-1 space-y-3">
                {colApps.length === 0 ? (
                  <div className="py-10 text-center text-[11px] text-slate-400 italic">
                    Chưa có hồ sơ
                  </div>
                ) : (
                  colApps.map((app) => (
                    <div
                      key={app._id}
                      className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-2.5 group"
                    >
                      {/* Tên ứng viên */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {app.candidateId?.fullName || "Chưa có tên"}
                          </h4>
                          <span className="text-[10px] text-indigo-700 font-medium line-clamp-1">
                            {app.positionId?.title || "Vị trí tuyển dụng"}
                          </span>
                        </div>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, id: app._id, name: app.candidateId?.fullName || "hồ sơ" })}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1 cursor-pointer"
                          title="Xóa hồ sơ"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Điểm & Nguồn */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-600">
                          {app.source || "Website"}
                        </span>
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          {app.score || 0}/100
                        </span>
                      </div>

                      {/* Phím chuyển trạng thái nhanh */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        {colIdx > 0 && (
                          <button
                            onClick={() => handleStatusChange(app._id, COLUMNS[colIdx - 1].id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title={"Lùi về " + COLUMNS[colIdx - 1].title}
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}
                        <span className="text-[9px] text-slate-400 font-medium">
                          {new Date(app.appliedAt).toLocaleDateString("vi-VN")}
                        </span>
                        {colIdx < COLUMNS.length - 1 && (
                          <button
                            onClick={() => handleStatusChange(app._id, COLUMNS[colIdx + 1].id)}
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer ml-auto"
                            title={"Chuyển sang " + COLUMNS[colIdx + 1].title}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Nút đặc biệt khi đạt trạng thái Hired: Chuyển sang Nhân viên chính thức */}
                      {app.status === "hired" && (
                        <button
                          onClick={() => handleOpenConvert(app)}
                          className="w-full mt-1.5 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Tạo Nhân Viên Chính Thức
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nộp Hồ Sơ Mới */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Tiếp Nhận Đơn Ứng Tuyển Mới</h3>
              <button onClick={() => setIsOpenModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Ứng Viên *</label>
                <select
                  required
                  value={formData.candidateId}
                  onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Chọn ứng viên đã có trong hệ thống --</option>
                  {candidates.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.fullName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vị Trí Tuyển Dụng *</label>
                <select
                  required
                  value={formData.positionId}
                  onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">-- Chọn vị trí việc làm --</option>
                  {positions.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} - {p.departmentId?.name || "Phòng ban"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kênh Tuyển Dụng</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Website">Website Công Ty</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="TopCV">TopCV</option>
                    <option value="VietnamWorks">VietnamWorks</option>
                    <option value="Referral">Nội Bộ Giới Thiệu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Điểm Đánh Giá Sơ Bộ</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ghi Chú Tiếp Nhận</label>
                <textarea
                  rows="2"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  placeholder="Ghi chú thêm về CV..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  Xác Nhận Nộp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chuyển Đổi Sang Nhân Viên Chính Thức */}
      {convertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 text-emerald-700">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Tiếp Nhận Nhân Viên Chính Thức</h3>
                <p className="text-[11px] text-slate-500">Chuyển hồ sơ sang danh sách nhân sự chính thức</p>
              </div>
            </div>

            <form onSubmit={handleConfirmConvert} className="space-y-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="text-slate-800 font-bold">
                  {convertModal.app?.candidateId?.fullName}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Vị trí: <span className="text-indigo-600 font-semibold">{convertModal.app?.positionId?.title}</span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Phòng ban: {convertModal.app?.positionId?.departmentId?.name || "Bộ phận chuyên môn"}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mức Lương Chính Thức (VNĐ) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000000"
                  value={convertModal.salary}
                  onChange={(e) => setConvertModal({ ...convertModal, salary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ngày Bắt Đầu Làm Việc *</label>
                <input
                  type="date"
                  required
                  value={convertModal.startDate}
                  onChange={(e) => setConvertModal({ ...convertModal, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConvertModal({ isOpen: false, app: null, salary: 25000000, startDate: "" })}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
                >
                  Tạo Hồ Sơ Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Xóa hồ sơ ứng tuyển"
        message={"Bạn có chắc chắn muốn xóa hồ sơ ứng tuyển của ứng viên \"" + deleteConfirm.name + "\"? Mọi kết quả phỏng vấn liên quan cũng sẽ bị xóa."}
        confirmText="Xác nhận xóa"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, name: "" })}
      />
    </div>
  );
};

export default Applications;