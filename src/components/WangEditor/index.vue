<template>
  <div>
    <div ref="editor" />
    <el-progress
      v-show="showProgress"
      :percentage="progress"
      :status="progress === 100 ? 'success' : 'exception'"
      :text-inside="true"
      :show-text="false"
    />
  </div>
</template>

<script>
import E from 'wangeditor'
import { Message } from 'element-ui'
import * as uploadHelper from '@/utils/uploadHelper'

export default {
  name: 'Editor',
  props: {
    syncContent: {
      type: String,
      default: '',
    },
    uploadUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      progress: 0,
      showProgress: false,
      baseURL: this.$store.getters.env.baseURL,
    }
  },
  watch: {
    syncContent(val) {
      val = val && val.replace(/(src\s*=\s*['"]?)([^'"]*files)/g, `$1${this.baseURL}/files`)
      this.editor.txt.html(val)
    },
  },
  created() {},
  mounted() {
    const self = this
    this.editor = new E(this.$refs.editor)
    const token = this.$store.getters.token

    // 使用 base64 保存图片
    this.editor.customConfig.uploadImgShowBase64 = false

    if (this.uploadUrl) {
      // // 将图片大小限制为 5M
      this.editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024
      // // 限制一次最多上传 50 张图片
      this.editor.customConfig.uploadImgMaxLength = 50
      // // 自定义上传参数
      // this.editor.customConfig.uploadImgParams = {}
      // // 自定义 header
      this.editor.customConfig.uploadImgHeaders = {
        'x-auth-token': token,
      }
      // // 自定义 fileName
      this.editor.customConfig.uploadFileName = 'file'

      // 上传图片至服务器
      this.editor.customConfig.customUploadImg = async (files, insert) => {
        for (var i = 0; i < files.length; i++) {
          try {
            self.showProgress = true
            const { data } = await uploadHelper.localUpload(
              this.baseURL + self.uploadUrl,
              {
                file: files[i],
              },
              self,
            )
            insert(this.baseURL + data.url)
          } catch (ex) {
            Message.error(ex && ex.msg)
          } finally {
            self.showProgress = false
            self.progress = 0
          }
        }
      }
    }

    // 显示“网络图片”tab
    this.editor.customConfig.showLinkImg = false
    this.editor.customConfig.zIndex = 100
    this.editor.customConfig.customAlert = function(err) {
      // err 是需要提示的内容
      Message.error(err)
    }
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      this.uploadUrl ? 'image' : '', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
    ]
    this.editor.customConfig.fontNames = ['宋体', '微软雅黑', 'Arial', 'Tahoma', 'Verdana']
    this.editor.customConfig.pasteFilterStyle = false
    this.editor.customConfig.pasteTextHandle = content => {
      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      content = content.replace(/<!--(.|\s)*?-->/g, '')

      return content
    }

    // 监控内容变化
    this.editor.customConfig.onchange = html => {
      html = html.replace(/(src\s*=\s*['"]?)([^'"]*files)/g, `$1/files`)
      this.$emit('sync', html)
    }

    this.editor.create()
  },
  methods: {},
}
</script>

<style>
.w-e-text-container {
  height: auto !important;
  min-height: 300px;
}
.w-e-text {
  min-height: 300px;
  max-height: 600px;
  overflow: auto;
}
</style>
