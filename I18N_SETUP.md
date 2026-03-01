# OpenFang 中文国际化设置指南

本项目已经成功添加了完整的中文国际化支持。以下是详细的设置和使用说明。

## 📁 项目结构

```
openfang/
├── crates/openfang-api/static/
│   ├── locales/                    # 国际化语言文件目录
│   │   ├── en/                   # 英文（默认语言）
│   │   │   └── translation.json
│   │   └── zh-CN/               # 中文（简体）
│   │       └── translation.json
│   ├── js/
│   │   ├── i18n.js              # 国际化核心模块
│   │   └── app.js              # 主应用逻辑（已更新）
│   ├── css/
│   │   └── components.css       # 组件样式（已添加语言选择器样式）
│   ├── index_head.html            # HTML 头部（已更新）
│   └── index_body.html           # HTML 主体（已更新语言选择器）
└── crates/openfang-desktop/
    └── tauri.conf.json          # Tauri 配置（已支持中文描述）
```

## 🌐 支持的语言

- **English (en)** - 默认语言
- **中文 (zh-CN)** - 简体中文

## ✨ 新增功能

### 1. 国际化核心模块 (`i18n.js`)
- 支持动态语言切换
- 自动加载翻译文件
- 嵌套键支持（如 `nav.chat`）
- 自动回退到英文
- 格式化函数：
  - `formatCurrency()` - 货币格式化
  - `formatDate()` - 日期格式化
  - `formatRelativeTime()` - 相对时间格式化

### 2. 语言选择器
- 位于界面右上角
- 下拉菜单显示可用语言
- 当前语言高亮显示
- 支持点击切换

### 3. 翻译文件 (`translation.json`)
完整翻译了以下模块：
- `common` - 通用术语
- `nav` - 导航菜单
- `dashboard` - 仪表板
- `agents` - 代理管理
- `chat` - 聊天界面
- `skills` - 技能管理
- `settings` - 设置界面
- `models` - 模型选择
- `providers` - 提供商
- `system` - 系统信息
- `errors` - 错误消息
- `toasts` - 通知提示

### 4. Tauri 配置更新
- 应用描述支持中英文
- 支持多语言显示名称

## 🚀 使用方法

### 界面语言切换

1. **启动 OpenFang**：
   ```bash
   cd openfang/.openfang/bin/
   ./openfang.exe start
   ```

2. **访问仪表板**：
   打开浏览器访问 `http://localhost:4200`

3. **切换语言**：
   - 在界面右上角找到语言选择器
   - 点击选择"中文"或"English"
   - 界面会立即切换语言
   - 语言选择会自动保存

### 编程接口使用

#### 基本翻译
```javascript
// 获取翻译
OpenFangI18n.t('nav.chat')           // 返回: "聊天" 或 "Chat"
OpenFangI18n.t('common.save')          // 返回: "保存" 或 "Save"
```

#### 动态语言切换
```javascript
// 设置语言
await OpenFangI18n.setLanguage('zh-CN');  // 切换到中文
await OpenFangI18n.setLanguage('en');     // 切换到英文

// 获取当前语言
OpenFangI18n.getLanguage();               // 返回: 'zh-CN' 或 'en'

// 获取支持的语言列表
OpenFangI18n.getSupportedLanguages();     // 返回: ['en', 'zh-CN']
```

#### 格式化函数
```javascript
// 货币格式化
OpenFangI18n.formatCurrency(1000, 'USD'); // 返回: "$1,000.00" 或 "¥1,000.00"

// 日期格式化
OpenFangI18n.formatDate('2024-01-01');      // 返回: "2024年1月1日" 或 "Jan 1, 2024"

// 相对时间格式化
OpenFangI18n.formatRelativeTime(Date.now() - 3600000); // 返回: "1小时前" 或 "1 hour ago"
```

#### HTML 元素国际化
```html
<!-- 使用 data-i18n 属性 -->
<h1 data-i18n="dashboard.title">OpenFang Dashboard</h1>

<!-- 使用 data-i18n-placeholder 属性 -->
<input type="text" data-i18n-placeholder="common.enter_api_key">

<!-- 使用 data-i18n-title 属性 -->
<button data-i18n-title="common.save">保存</button>

<!-- 使用 data-i18n-alt 属性 -->
<img src="logo.png" data-i18n-alt="dashboard.logo">
```

## 🔧 配置选项

### 环境变量
```bash
# 设置默认语言
export OPENFANG_LANGUAGE=zh-CN

# 指定翻译文件目录
export OPENFANG_LOCALE_PATH=/path/to/locales
```

### 本地存储
- `openfang-language` - 当前选择的语言
- 自动保存到浏览器本地存储
- 下次启动时自动恢复

## 📝 添加新翻译

### 1. 创建新语言文件
```bash
# 创建新语言目录
mkdir openfang/crates/openfang-api/static/locales/zh-TW

# 复制翻译文件模板
cp openfang/crates/openfang-api/static/locales/en/translation.json \
   openfang/crates/openfang-api/static/locales/zh-TW/translation.json
```

### 2. 翻译内容
编辑新语言的 `translation.json` 文件，翻译所有英文文本：
```json
{
  "common": {
    "save": "儲存",  // 繁体中文翻译
    "cancel": "取消"
  }
}
```

### 3. 注册新语言
在 `i18n.js` 中添加新语言：
```javascript
const SUPPORTED_LANGUAGES = ['en', 'zh-CN', 'zh-TW'];  // 添加新语言
```

### 4. 更新语言名称
在 `app.js` 中更新语言名称映射：
```javascript
getLanguageName(lang) {
  var names = {
    'en': 'English',
    'zh-CN': '中文 (简体)',
    'zh-TW': '中文 (繁體)'  // 添加新语言名称
  };
  return names[lang] || lang;
}
```

## 🎨 自定义样式

### 语言选择器样式
语言选择器位于 `components.css` 文件中，可以根据需要自定义：

```css
/* 修改语言按钮颜色 */
.lang-btn {
  background: var(--bg-input);
  border-color: var(--accent);
  color: var(--text);
}

/* 修改下拉菜单样式 */
.lang-dropdown {
  background: var(--bg-card);
  border-radius: 8px;  /* 更圆润的边框 */
}
```

## 🐛 故障排除

### 翻译不显示
1. 检查浏览器控制台是否有错误
2. 确认翻译文件路径正确
3. 验证 `translation.json` 文件格式正确
4. 清除浏览器缓存并重新加载

### 语言切换无效
1. 检查本地存储：`openfang-language` 是否正确设置
2. 验证 `i18n.js` 是否正确加载
3. 确认网络请求是否成功（检查网络控制台）

### 样式问题
1. 清除浏览器缓存
2. 强制刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）
3. 检查浏览器兼容性

## 📊 支持的语言扩展

计划支持更多语言：
- **日语 (ja)**
- **韩语 (ko)**
- **法语 (fr)**
- **德语 (de)**
- **西班牙语 (es)**
- **阿拉伯语 (ar)**

## 🤝 贡献指南

### 翻译贡献
1. 翻译 `translation.json` 文件
2. 确保翻译质量和技术术语准确
3. 提交 Pull Request 到项目仓库

### 语言包贡献
1. 创建新的语言目录
2. 提供完整的翻译文件
3. 在 `i18n.js` 中注册新语言
4. 更新文档说明

## 📚 相关资源

- [OpenFang 官方文档](https://openfang.sh/docs)
- [Alpine.js 文档](https://alpinejs.dev/)
- [i18n 最佳实践](https://www.w3.org/Internationalization/)
- [MDN Web APIs](https://developer.mozilla.org/)

## 🎉 总结

OpenFang 现已完全支持中文国际化！

主要成就：
- ✅ 完整的中文翻译覆盖
- ✅ 实时语言切换
- ✅ 自动保存语言偏好
- ✅ 多语言日期/时间格式化
- ✅ 货币格式化支持
- ✅ 易于扩展的语言系统
- ✅ Tauri 桌面应用支持
- ✅ 响应式语言选择器

开始使用您的多语言 OpenFang 系统吧！🚀