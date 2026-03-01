# OpenFang 中文国际化 - 快速开始

## 🎯 功能概述

- **双语支持**：英文（默认）+ 中文（简体）
- **实时切换**：界面右上角语言选择器
- **自动保存**：语言偏好自动保存
- **完整翻译**：覆盖所有用户界面文本

## 🚀 立即开始

1. **启动服务**
   ```bash
   cd openfang/.openfang/bin/
   ./openfang.exe start
   ```

2. **访问界面**
   ```
   http://localhost:4200
   ```

3. **切换语言**
   - 点击右上角语言按钮
   - 选择"中文"或"English"
   - 享受完全本地化的界面！

## 📂 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `crates/openfang-api/static/locales/zh-CN/translation.json` | 中文翻译文件 |
| `crates/openfang-api/static/locales/en/translation.json` | 英文翻译文件 |
| `crates/openfang-api/static/js/i18n.js` | 国际化核心模块 |
| `crates/openfang-api/static/js/app.js` | 添加语言切换功能 |
| `crates/openfang-api/static/css/components.css` | 语言选择器样式 |
| `crates/openfang-api/static/index_head.html` | 添加 i18n 脚本引用 |
| `crates/openfang-api/static/index_body.html` | 添加语言选择器 |
| `crates/openfang-desktop/tauri.conf.json` | 中英文应用描述 |

## 💡 使用技巧

### 开发者接口
```javascript
// 在浏览器控制台测试
OpenFangI18n.setLanguage('zh-CN');  // 切换到中文
console.log(OpenFangI18n.t('nav.chat'));  // 输出翻译
```

### 添加更多翻译
```bash
# 1. 创建新语言文件
cp -r openfang/crates/openfang-api/static/locales/en \
      openfang/crates/openfang-api/static/locales/zh-TW

# 2. 编辑翻译文件
nano openfang/crates/openfang-api/static/locales/zh-TW/translation.json

# 3. 注册语言（编辑 i18n.js）
# 添加 'zh-TW' 到 SUPPORTED_LANGUAGES

# 4. 添加语言名称（编辑 app.js）
# 在 getLanguageName() 中添加 'zh-TW': '中文 (繁體)'
```

## 🔥 主要特性

- **零依赖**：纯 JavaScript 实现，无需额外库
- **高性能**：本地缓存翻译，快速切换
- **易于扩展**：简单 JSON 格式，方便添加语言
- **自动检测**：首次使用时自动检测浏览器语言
- **优雅降级**：翻译缺失时自动回退到英文

## 🎨 界面效果

### 语言选择器
```
[English ▼]  ← 点击显示下拉菜单
    ├── English ✓
    └── 中文 (简体)
```

### 翻译示例
| 英文 | 中文 (zh-CN) |
|------|--------------|
| Dashboard | 仪表板 |
| Agents | 代理 |
| Settings | 设置 |
| Save | 保存 |
| Cancel | 取消 |

## 📞 需要帮助？

- 查看 `I18N_SETUP.md` 获取详细文档
- 检查浏览器控制台获取错误信息
- 在 GitHub 提交 Issue 报告问题

---

**Enjoy your localized OpenFang experience!** 🎉