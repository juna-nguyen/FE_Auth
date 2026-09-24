import React, { useState } from "react";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Toast from "../../components/ui/Toast";

export function UserManagementPage({ currentUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [selectedModalRole, setSelectedModalRole] = useState("user");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const isAdmin = currentUser?.role === "admin";

  const [usersList, setUsersList] = useState([
    {
      id: "usr_001",
      name: currentUser?.name || "Nguyễn Văn A",
      email: currentUser?.email || "admin@authshield.io",
      role: currentUser?.role || "admin",
      status: "Active",
      createdAt: currentUser?.createdAt || "2026-09-24T08:30:00.000Z",
      mfa: true,
      lastLogin: "Vừa xong",
    },
    {
      id: "usr_002",
      name: "Trần Thị Mai",
      email: "mai.tran@cloud-security.org",
      role: "admin",
      status: "Active",
      createdAt: "2026-09-20T04:12:00.000Z",
      mfa: true,
      lastLogin: "10 phút trước",
    },
    {
      id: "usr_003",
      name: "Lê Hoàng Nam",
      email: "nam.le@devops-corp.io",
      role: "user",
      status: "Active",
      createdAt: "2026-09-18T14:22:00.000Z",
      mfa: false,
      lastLogin: "2 giờ trước",
    },
    {
      id: "usr_004",
      name: "Phạm Thu Hương",
      email: "huong.pham@fintech-asia.vn",
      role: "user",
      status: "Suspended",
      createdAt: "2026-09-15T09:00:00.000Z",
      mfa: false,
      lastLogin: "3 ngày trước",
    },
    {
      id: "usr_005",
      name: "Đỗ Quốc Bảo",
      email: "bao.do@security-vault.net",
      role: "user",
      status: "Active",
      createdAt: "2026-09-10T11:45:00.000Z",
      mfa: true,
      lastLogin: "1 ngày trước",
    },
  ]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenRoleModal = (targetUser) => {
    if (!isAdmin) {
      triggerToast("Chỉ Superuser Admin mới có quyền sửa chính sách RBAC!");
      return;
    }
    setRoleModalUser(targetUser);
    setSelectedModalRole(targetUser.role);
  };

  const handleSaveRole = () => {
    if (!roleModalUser) return;
    setUsersList((prev) =>
      prev.map((u) => (u.id === roleModalUser.id ? { ...u, role: selectedModalRole } : u))
    );
    triggerToast(`Đã cập nhật quyền của ${roleModalUser.name} thành "${selectedModalRole}"`);
    setRoleModalUser(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFEBF1] via-[#FFF0F5] to-[#FFFFFF] border border-[#FAD6DF] shadow-[0_8px_24px_rgba(233,114,150,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-headline text-[#4A353A]">
              Quản lý Phân quyền & RBAC IAM
            </h2>
            <Badge variant="cluster">RBAC Matrix</Badge>
          </div>
          <p className="text-xs text-[#7D676E] mt-1">
            Quản trị viên Superuser điều phối quyền truy cập các API endpoints được bảo vệ.
          </p>
        </div>

        {!isAdmin && (
          <div className="p-3 rounded-2xl bg-[#FFEBF0] border border-[#FFCCD7] text-[#C8234D] text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Bạn đang ở chế độ Xem (Tài khoản Standard User)</span>
          </div>
        )}
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Danh sách Người dùng Hệ thống ({filteredUsers.length})</CardTitle>
            <CardDescription>
              Tất cả tài khoản định danh trong Database và phân quyền tương ứng
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Tìm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                iconLeft={<span className="material-symbols-outlined text-[16px]">search</span>}
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#FFFFFF] border border-[#FAD6DF] rounded-xl text-xs text-[#4A353A] font-semibold px-3 py-2.5 focus:outline-none focus:border-[#FF8DA1] focus:ring-2 focus:ring-[#FF8DA1]/20 cursor-pointer shadow-2xs"
            >
              <option value="all">Tất cả quyền hạn (All)</option>
              <option value="admin">Superuser (Admin)</option>
              <option value="user">Standard (User)</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#4A353A]">
              <thead>
                <tr className="border-b border-[#FAD6DF] text-[#7D676E]">
                  <th className="pb-3 font-bold">NGƯỜI DÙNG</th>
                  <th className="pb-3 font-bold">VAI TRÒ (ROLE)</th>
                  <th className="pb-3 font-bold">TRẠNG THÁI</th>
                  <th className="pb-3 font-bold">2FA / MFA</th>
                  <th className="pb-3 font-bold">ĐĂNG NHẬP CUỐI</th>
                  <th className="pb-3 font-bold text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FAD6DF]/60">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-[#FFF0F5] transition-colors">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF8DA1] to-[#E8A0BF] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                          {userItem.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#4A353A]">{userItem.name}</p>
                          <p className="text-[11px] text-[#7D676E] font-mono">{userItem.email}</p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <Badge variant={userItem.role === "admin" ? "admin" : "user"}>
                        {userItem.role.toUpperCase()}
                      </Badge>
                    </td>

                    <td>
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          userItem.status === "Active" ? "text-[#1B7A5C]" : "text-[#C8234D]"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {userItem.status}
                      </span>
                    </td>

                    <td>
                      {userItem.mfa ? (
                        <span className="text-[#1B7A5C] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">verified</span> Bật
                        </span>
                      ) : (
                        <span className="text-[#967C84]">Tắt</span>
                      )}
                    </td>

                    <td className="text-[#7D676E]">{userItem.lastLogin}</td>

                    <td className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenRoleModal(userItem)}
                        icon={<span className="material-symbols-outlined text-[14px]">edit</span>}
                      >
                        Sửa quyền
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Policy Edit Modal */}
      <Modal
        isOpen={!!roleModalUser}
        onClose={() => setRoleModalUser(null)}
        title="Điều chỉnh chính sách quyền RBAC"
        subtitle={`Cập nhật quyền truy cập cho ${roleModalUser?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleModalUser(null)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" onClick={handleSaveRole}>
              Áp dụng & Lưu chính sách
            </Button>
          </>
        }
      >
        {roleModalUser && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#FFF0F5] border border-[#FAD6DF] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF8DA1] to-[#FF69B4] text-white flex items-center justify-center font-bold">
                {roleModalUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-xs text-[#4A353A]">{roleModalUser.name}</p>
                <p className="text-[11px] text-[#7D676E] font-mono">{roleModalUser.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7D676E]">
                Chọn cấp bậc đặc quyền
              </label>

              <div className="space-y-2">
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedModalRole === "admin"
                      ? "bg-[#FFEBF1] border-[#FF8DA1] shadow-xs"
                      : "bg-[#FFFFFF] border-[#FAD6DF] hover:border-[#FFB6C1]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={selectedModalRole === "admin"}
                    onChange={() => setSelectedModalRole("admin")}
                    className="mt-1 text-[#FF69B4] focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#4A353A]">
                        Quản trị viên (Administrator)
                      </span>
                      <Badge variant="admin">Full Control</Badge>
                    </div>
                    <p className="text-[11px] text-[#7D676E] mt-0.5">
                      Toàn quyền truy cập khu vực quản trị, xem chỉ số thống kê và quản lý người dùng.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedModalRole === "user"
                      ? "bg-[#FFEBF1] border-[#FF8DA1] shadow-xs"
                      : "bg-[#FFFFFF] border-[#FAD6DF] hover:border-[#FFB6C1]"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedModalRole === "user"}
                    onChange={() => setSelectedModalRole("user")}
                    className="mt-1 text-[#FF69B4] focus:ring-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#4A353A]">
                        Người dùng chuẩn (User)
                      </span>
                      <Badge variant="user">Restricted</Badge>
                    </div>
                    <p className="text-[11px] text-[#7D676E] mt-0.5">
                      Xem thông tin cá nhân, cập nhật mật khẩu và các tính năng người dùng thông thường.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Toast show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  );
}

export default UserManagementPage;