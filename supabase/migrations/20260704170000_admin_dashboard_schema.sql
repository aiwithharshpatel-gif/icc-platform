-- Admin Dashboard Schema
-- Tables for roles, activity logs, content reports, and pending approvals

-- ============================================
-- 1. Admin Roles
-- ============================================
CREATE TABLE IF NOT EXISTS admin_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_admin_roles_user ON admin_roles(user_id);
CREATE INDEX idx_admin_roles_role ON admin_roles(role);

-- ============================================
-- 2. Admin Activity Logs
-- ============================================
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL DEFAULT 'System',
  action TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'approve', 'reject', 'suspend', 'restore')),
  target_type TEXT NOT NULL,
  target_id TEXT,
  target_name TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_activity_logs_created ON admin_activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_activity_logs_type ON admin_activity_logs(action_type);

-- ============================================
-- 3. Content Reports
-- ============================================
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_name TEXT NOT NULL DEFAULT 'Anonymous',
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'member', 'event', 'campsite')),
  content_id TEXT NOT NULL,
  content_preview TEXT,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON content_reports(status, created_at DESC);
CREATE INDEX idx_reports_type ON content_reports(content_type);

-- ============================================
-- 4. Pending Approvals
-- ============================================
CREATE TABLE IF NOT EXISTS pending_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('event', 'campsite', 'post')),
  item_id TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_preview TEXT,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_by_name TEXT NOT NULL DEFAULT 'Unknown',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

CREATE INDEX idx_approvals_status ON pending_approvals(status, created_at DESC);
CREATE INDEX idx_approvals_type ON pending_approvals(item_type);

-- ============================================
-- Row Level Security
-- ============================================
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_approvals ENABLE ROW LEVEL SECURITY;

-- Admin roles: admins can read all, users can read own
CREATE POLICY "Admins can manage roles" ON admin_roles FOR ALL USING (true);
CREATE POLICY "Read activity logs" ON admin_activity_logs FOR SELECT USING (true);
CREATE POLICY "Insert activity logs" ON admin_activity_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Read reports" ON content_reports FOR ALL USING (true);
CREATE POLICY "Manage approvals" ON pending_approvals FOR ALL USING (true);
