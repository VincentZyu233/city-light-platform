import { Building2, Cpu, FolderKanban, HardDriveUpload, MapPinned, Network, ShieldCheck, Users, Wrench } from 'lucide-react';
import { ManagementPage } from '@/components/management-page';
import { departments, deployments, deviceModels, deviceTypes, devices, projects, roles, stations, users } from '@/data/mock-data';

export function ProjectListPage() {
  return (
    <ManagementPage
      eyebrow="项目管理 / 项目列表"
      title="智慧照明项目"
      description="统一维护项目范围、场站规模、设备数量与整体在线率。"
      icon={FolderKanban}
      rows={projects.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '项目编号', format: 'mono', width: '110px' },
        { key: 'name', label: '项目名称' },
        { key: 'city', label: '区域' },
        { key: 'owner', label: '负责人' },
        { key: 'stations', label: '场站', format: 'number' },
        { key: 'devices', label: '设备', format: 'number' },
        { key: 'onlineRate', label: '在线率', format: 'progress', width: '150px' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '项目编号', placeholder: '如 PRJ-007' },
        { key: 'name', label: '项目名称' },
        { key: 'city', label: '所属区域' },
        { key: 'owner', label: '负责人' },
        { key: 'stations', label: '场站数量', type: 'number' },
        { key: 'devices', label: '设备数量', type: 'number' },
        { key: 'onlineRate', label: '在线率', type: 'number' },
        { key: 'status', label: '项目状态', type: 'select', options: ['运行中', '建设调试', '规划中', '已结束'] },
        { key: 'updatedAt', label: '更新时间', placeholder: '2026-10-24 10:00' },
      ]}
      searchKeys={['id', 'name', 'city', 'owner']}
      statusOptions={['运行中', '建设调试', '规划中', '已结束']}
      createLabel="新增项目"
      idPrefix="PRJ"
      stats={[
        { label: '项目总数', value: String(projects.length), unit: '个' },
        { label: '在线设备', value: '5,420', unit: '台' },
        { label: '平均在线率', value: '98.47', unit: '%' },
      ]}
    />
  );
}

export function StationListPage() {
  return (
    <ManagementPage
      eyebrow="项目管理 / 场站管理"
      title="场站与路段"
      description="按项目和区域管理照明场站、道路路段、设备规模与运维负责人。"
      icon={MapPinned}
      rows={stations.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '场站编号', format: 'mono', width: '110px' },
        { key: 'name', label: '场站名称' },
        { key: 'project', label: '所属项目' },
        { key: 'address', label: '地址' },
        { key: 'devices', label: '设备', format: 'number' },
        { key: 'onlineRate', label: '在线率', format: 'progress', width: '150px' },
        { key: 'manager', label: '负责人' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '场站编号' },
        { key: 'name', label: '场站名称' },
        { key: 'project', label: '所属项目', type: 'select', options: projects.map((item) => item.name) },
        { key: 'address', label: '详细地址' },
        { key: 'devices', label: '设备数量', type: 'number' },
        { key: 'onlineRate', label: '在线率', type: 'number' },
        { key: 'manager', label: '负责人' },
        { key: 'status', label: '状态', type: 'select', options: ['在线', '调试', '未启用', '停用'] },
      ]}
      searchKeys={['id', 'name', 'project', 'address', 'manager']}
      statusOptions={['在线', '调试', '未启用', '停用']}
      createLabel="新增场站"
      idPrefix="ST"
      stats={[
        { label: '场站总数', value: String(stations.length), unit: '个' },
        { label: '覆盖道路', value: '126', unit: '公里' },
        { label: '异常场站', value: '1', unit: '个' },
      ]}
    />
  );
}

export function DeviceTypesPage() {
  return (
    <ManagementPage
      eyebrow="设备管理 / 设备类型"
      title="设备类型"
      description="维护智慧灯杆、照明灯具、控制器和边缘网关等设备分类。"
      icon={Network}
      rows={deviceTypes.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '类型编号', format: 'mono' },
        { key: 'name', label: '设备类型' },
        { key: 'category', label: '业务分类' },
        { key: 'protocol', label: '默认协议' },
        { key: 'powerRange', label: '功率范围', format: 'mono' },
        { key: 'deviceCount', label: '设备数量', format: 'number' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '类型编号' },
        { key: 'name', label: '设备类型' },
        { key: 'category', label: '业务分类' },
        { key: 'protocol', label: '通信协议', type: 'select', options: ['Cat.1', 'NB-IoT', 'PLC', 'LoRaWAN', 'Ethernet'] },
        { key: 'powerRange', label: '功率范围' },
        { key: 'deviceCount', label: '设备数量', type: 'number' },
        { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
      ]}
      searchKeys={['id', 'name', 'category', 'protocol']}
      statusOptions={['启用', '停用']}
      createLabel="新增类型"
      idPrefix="DT"
      stats={[{ label: '设备类型', value: String(deviceTypes.length), unit: '类' }, { label: '已接入设备', value: '5,420', unit: '台' }, { label: '启用类型', value: '5', unit: '类' }]}
    />
  );
}

export function DeviceModelsPage() {
  return (
    <ManagementPage
      eyebrow="设备管理 / 设备型号"
      title="设备型号"
      description="管理设备型号、厂商、固件版本及协议适配关系。"
      icon={Cpu}
      rows={deviceModels.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '型号编号', format: 'mono' },
        { key: 'name', label: '设备型号', format: 'mono' },
        { key: 'type', label: '设备类型' },
        { key: 'manufacturer', label: '厂商' },
        { key: 'protocol', label: '通信协议' },
        { key: 'firmware', label: '固件版本', format: 'mono' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '型号编号' },
        { key: 'name', label: '设备型号' },
        { key: 'type', label: '设备类型', type: 'select', options: deviceTypes.map((item) => item.name) },
        { key: 'manufacturer', label: '制造商' },
        { key: 'protocol', label: '通信协议', type: 'select', options: ['Cat.1', 'NB-IoT', 'PLC', 'LoRaWAN', 'Ethernet'] },
        { key: 'firmware', label: '固件版本' },
        { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
      ]}
      searchKeys={['id', 'name', 'type', 'manufacturer', 'firmware']}
      statusOptions={['启用', '停用']}
      createLabel="新增型号"
      idPrefix="DM"
      stats={[{ label: '型号总数', value: String(deviceModels.length), unit: '个' }, { label: '启用型号', value: '7', unit: '个' }, { label: '最新固件', value: 'v4.1.0' }]}
    />
  );
}

export function DeviceListPage() {
  return (
    <ManagementPage
      eyebrow="设备管理 / 设备列表"
      title="照明设备"
      description="查看设备部署状态、功率、调光比例、温度及最近通信时间。"
      icon={Wrench}
      rows={devices.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '设备编号', format: 'mono', width: '110px' },
        { key: 'name', label: '设备名称' },
        { key: 'project', label: '所属项目' },
        { key: 'station', label: '场站' },
        { key: 'model', label: '型号', format: 'mono' },
        { key: 'status', label: '状态', format: 'status' },
        { key: 'dimming', label: '调光', format: 'progress', width: '150px' },
        { key: 'temperature', label: '温度', format: 'number' },
        { key: 'lastSeen', label: '最后通信' },
      ]}
      fields={[
        { key: 'id', label: '设备编号' },
        { key: 'name', label: '设备名称' },
        { key: 'project', label: '所属项目', type: 'select', options: projects.map((item) => item.name) },
        { key: 'station', label: '所属场站', type: 'select', options: stations.map((item) => item.name) },
        { key: 'type', label: '设备类型', type: 'select', options: deviceTypes.map((item) => item.name) },
        { key: 'model', label: '设备型号', type: 'select', options: deviceModels.map((item) => item.name) },
        { key: 'status', label: '设备状态', type: 'select', options: ['在线', '调光', '告警', '离线'] },
        { key: 'protocol', label: '通信协议', type: 'select', options: ['Cat.1', 'NB-IoT', 'PLC', 'LoRaWAN'] },
        { key: 'dimming', label: '调光比例', type: 'number' },
        { key: 'power', label: '实时功率', type: 'number' },
        { key: 'voltage', label: '电压', type: 'number' },
        { key: 'current', label: '电流', type: 'number' },
        { key: 'temperature', label: '温度', type: 'number' },
        { key: 'lastSeen', label: '最后通信' },
      ]}
      searchKeys={['id', 'name', 'project', 'station', 'model', 'status']}
      statusOptions={['在线', '调光', '告警', '离线']}
      createLabel="新增设备"
      idPrefix="DEV"
      stats={[{ label: '设备总数', value: '5,420', unit: '台' }, { label: '在线设备', value: '5,411', unit: '台' }, { label: '异常设备', value: '9', unit: '台' }]}
    />
  );
}

export function DeviceDeploymentPage() {
  return (
    <ManagementPage
      eyebrow="设备管理 / 设备部署"
      title="设备部署"
      description="维护设备与项目、场站、回路之间的部署关系和复核状态。"
      icon={HardDriveUpload}
      rows={deployments.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '部署编号', format: 'mono' },
        { key: 'deviceId', label: '设备编号', format: 'mono' },
        { key: 'project', label: '所属项目' },
        { key: 'station', label: '场站' },
        { key: 'circuit', label: '回路', format: 'mono' },
        { key: 'deployedAt', label: '部署时间' },
        { key: 'operator', label: '操作人' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '部署编号' },
        { key: 'deviceId', label: '设备编号' },
        { key: 'project', label: '所属项目', type: 'select', options: projects.map((item) => item.name) },
        { key: 'station', label: '所属场站', type: 'select', options: stations.map((item) => item.name) },
        { key: 'circuit', label: '部署回路' },
        { key: 'deployedAt', label: '部署时间' },
        { key: 'operator', label: '操作人' },
        { key: 'status', label: '部署状态', type: 'select', options: ['已部署', '待复核', '调试中', '待部署'] },
      ]}
      searchKeys={['id', 'deviceId', 'project', 'station', 'operator']}
      statusOptions={['已部署', '待复核', '调试中', '待部署']}
      createLabel="新增部署"
      idPrefix="DEP"
      stats={[{ label: '部署记录', value: String(deployments.length), unit: '条' }, { label: '已部署设备', value: '5,158', unit: '台' }, { label: '待复核', value: '262', unit: '台' }]}
    />
  );
}

export function DepartmentsPage() {
  return (
    <ManagementPage
      eyebrow="组织管理 / 部门管理"
      title="组织部门"
      description="维护企业部门层级、负责人和成员规模，为数据权限提供组织基础。"
      icon={Building2}
      rows={departments.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '部门编号', format: 'mono' },
        { key: 'name', label: '部门名称' },
        { key: 'leader', label: '负责人' },
        { key: 'members', label: '成员数', format: 'number' },
        { key: 'parent', label: '上级组织' },
        { key: 'updatedAt', label: '更新时间' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '部门编号' },
        { key: 'name', label: '部门名称' },
        { key: 'leader', label: '负责人' },
        { key: 'members', label: '成员数量', type: 'number' },
        { key: 'parent', label: '上级组织' },
        { key: 'updatedAt', label: '更新时间' },
        { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
      ]}
      searchKeys={['id', 'name', 'leader', 'parent']}
      statusOptions={['启用', '停用']}
      createLabel="新增部门"
      idPrefix="ORG"
      stats={[{ label: '部门总数', value: String(departments.length), unit: '个' }, { label: '组织成员', value: '204', unit: '人' }, { label: '启用部门', value: '5', unit: '个' }]}
    />
  );
}

export function RolesPage() {
  return (
    <ManagementPage
      eyebrow="组织管理 / 角色管理"
      title="角色与权限"
      description="配置角色权限范围、数据边界和关联用户数量。"
      icon={ShieldCheck}
      rows={roles.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '角色编号', format: 'mono' },
        { key: 'name', label: '角色名称' },
        { key: 'code', label: '角色编码', format: 'mono' },
        { key: 'users', label: '用户数', format: 'number' },
        { key: 'scope', label: '数据范围' },
        { key: 'permissions', label: '权限说明' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '角色编号' },
        { key: 'name', label: '角色名称' },
        { key: 'code', label: '角色编码' },
        { key: 'users', label: '用户数量', type: 'number' },
        { key: 'scope', label: '数据范围', type: 'select', options: ['全平台', '所属项目', '所属场站', '指定看板', '指定设备'] },
        { key: 'permissions', label: '权限说明', type: 'textarea' },
        { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
      ]}
      searchKeys={['id', 'name', 'code', 'scope', 'permissions']}
      statusOptions={['启用', '停用']}
      createLabel="新增角色"
      idPrefix="ROLE"
      stats={[{ label: '角色总数', value: String(roles.length), unit: '个' }, { label: '启用角色', value: '5', unit: '个' }, { label: '绑定用户', value: '57', unit: '人' }]}
    />
  );
}

export function UsersPage() {
  return (
    <ManagementPage
      eyebrow="组织管理 / 用户管理"
      title="平台用户"
      description="管理账号、所属部门、角色、联系方式与最近登录状态。"
      icon={Users}
      rows={users.map((item) => ({ ...item }))}
      columns={[
        { key: 'id', label: '用户编号', format: 'mono' },
        { key: 'name', label: '姓名' },
        { key: 'account', label: '账号', format: 'mono' },
        { key: 'department', label: '部门' },
        { key: 'role', label: '角色' },
        { key: 'phone', label: '手机号', format: 'mono' },
        { key: 'lastLogin', label: '最近登录' },
        { key: 'status', label: '状态', format: 'status' },
      ]}
      fields={[
        { key: 'id', label: '用户编号' },
        { key: 'name', label: '姓名' },
        { key: 'account', label: '登录账号' },
        { key: 'department', label: '所属部门', type: 'select', options: departments.map((item) => item.name) },
        { key: 'role', label: '角色', type: 'select', options: roles.map((item) => item.name) },
        { key: 'phone', label: '手机号' },
        { key: 'lastLogin', label: '最近登录' },
        { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] },
      ]}
      searchKeys={['id', 'name', 'account', 'department', 'role', 'phone']}
      statusOptions={['启用', '停用']}
      createLabel="新增用户"
      idPrefix="USR"
      stats={[{ label: '用户总数', value: String(users.length), unit: '人' }, { label: '启用账号', value: '9', unit: '个' }, { label: '今日登录', value: '27', unit: '人' }]}
    />
  );
}
