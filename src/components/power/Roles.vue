<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card" >
         <el-button type="primary" @click="addRolesDialogVisible = true">添加角色</el-button>
          <el-table
            :data="rolesList"
            height="420"
            border
            style="width: 100%">
            <el-table-column
            type="index"
            label="#"
            width="60">
            </el-table-column>
            <el-table-column
            prop="roleName"
            label="角色名称">
            </el-table-column>
            <el-table-column
            prop="roleDesc"
            label="角色描述">
            </el-table-column>
            <el-table-column
            prop="level"
            label="操作">
              <template slot-scope='scope' >
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="ShowRolesDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesUserById(scope.row.id)"></el-button>
              <!-- 分配 -->
                 <el-tooltip effect="dark" content="分配权限" placement="top" >
                  <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRolesDialog(scope.row)"></el-button>
                </el-tooltip>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
    <!-- 编辑角色 -->
    <el-dialog
        title="修改用户信息"
        :visible.sync="RolesDialogVisible"
        width="50%" @close="RolesDialogClose">
        <!-- 内容 -->
        <el-form :model="rolesForm" ref="editFormRef" label-width="100px" :rules="RoleFormRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="RolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRolesInfo">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog
        title="添加角色"
        :visible.sync="addRolesDialogVisible"
        width="50%" @close="addRolesDialogClose">
        <!-- 内容 -->
        <el-form :model="addRolesForm" :rules="RoleFormRules" ref="addRolesFormRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRolesDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRolesUser">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 展示分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRolesDialogVisible"
      width="50%"
      @close= 'setRightDialogClosed'>
      <!-- 树形控件 -->
      <el-tree :data="rightslists" :props="treeProps"  show-checkbox node-key='id' default-expand-all :default-checked-keys='defKeys' ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  data() {
    return {
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      rolesList: [],
      rolesForm: {},
      RolesDialogVisible: false,
      addRolesDialogVisible: false,
      // 控制分配权限的对话框的显示与隐藏
      setRolesDialogVisible: false,
      RoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      rightslists: [],
      // 树形控制的属性绑定对象
      treeProps: {
        label: 'authName',
        childreen: 'childreen'
      },
      // 默认选中的节点id值数组
      defKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // this.$message.success('获取角色列表成功')
      this.rolesList = res.data
    //   console.log(this.rolesList)
    },
    // 编辑角色
    async ShowRolesDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.$message.success('获取角色列表成功')
      this.rolesForm = res.data
      // console.log(this.rolesForm)
      this.RolesDialogVisible = true
    },
    RolesDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    editRolesInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        const { data: res } = await this.$http.put(
          'roles/' + this.rolesForm.roleId,
          {
            roleName: this.rolesForm.roleName,
            roleDesc: this.rolesForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败！')
        }
        // 隐藏编辑角色对话框
        this.RolesDialogVisible = false
        this.$message.success('更新角色信息成功！')
        this.getRolesList()
      })
    },
    // 添加角色
    addRolesUser() {
      // 预验证
      this.$refs.addRolesFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起添加用户的网络请求
        await this.$http.post('roles', this.addRolesForm).then((response) => {
          // console.log(response.data)
          if (response.data.meta.status === 201) {
            this.$message.success('添加用户成功')
            this.addRolesDialogVisible = false
            // 重新获取用户列表
            this.getRolesList()
          } else {
            this.$message.error('添加用户失败')
          }
        }).catch(error => {
          console.log(error)
        })
      })
    },
    addRolesDialogClose() {
      this.$refs.addRolesFormRef.resetFields()
    },
    async removeRolesUserById (id) {
      // 弹框提示
      const confirmResult = await this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除， 则返回值为字符串 confirm
      // 如果用户确认删除， 则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户信息失败')
      }
      this.$message.success('删除用户信息成功')
      this.getRolesList()
    },
    // 展示分配权限的列表
    async showSetRolesDialog(role) {
      // 分配权限的id
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取的权限数据保存到righslist 中
      this.rightslists = res.data
      // console.log(this.rightslists)
      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRolesDialogVisible = true
    },
    // 通过递归的形式， 获取角色下所有的三级权限的id， 并保存到 defKeys
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性， 则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
      // console.log(arr)
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idstr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rides: idstr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRolesDialogVisible = false
    }
  }
}
</script>
<style>
</style>
