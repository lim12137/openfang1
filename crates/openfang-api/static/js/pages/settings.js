// OpenFang Settings Page — Provider Hub, Model Catalog, Config, Tools + Security, Network, Migration tabs
'use strict';

function settingsPage() {
  return {
    tab: 'providers',
    sysInfo: {},
    usageData: [],
    tools: [],
    config: {},
    providers: [],
    models: [],
    toolSearch: '',
    modelSearch: '',
    modelProviderFilter: '',
    modelTierFilter: '',
    showCustomModelForm: false,
    customModelId: '',
    customModelProvider: 'openrouter',
    customModelContext: 128000,
    customModelMaxOutput: 8192,
    customModelStatus: '',
    providerKeyInputs: {},
    providerUrlInputs: {},
    providerUrlSaving: {},
    providerTesting: {},
    providerTestResults: {},
    copilotOAuth: { polling: false, userCode: '', verificationUri: '', pollId: '', interval: 5 },
    loading: true,
    loadError: '',

    // -- Dynamic config state --
    configSchema: null,
    configValues: {},
    configDirty: {},
    configSaving: {},

    // -- Security state --
    securityData: null,
    secLoading: false,
    verifyingChain: false,
    chainResult: null,

    // Security feature definitions (with translation keys)
    coreFeatures: [
      {
        key: 'path_traversal',
        impl: 'host_functions.rs — safe_resolve_path() + safe_resolve_parent()'
      },
      {
        key: 'ssrf_protection',
        impl: 'host_functions.rs — is_ssrf_target() + is_private_ip()'
      },
      {
        key: 'capability_system',
        impl: 'host_functions.rs — check_capability() on every host function'
      },
      {
        key: 'privilege_escalation_prevention',
        impl: 'kernel_handle.rs — spawn_agent_checked()'
      },
      {
        key: 'subprocess_isolation',
        impl: 'subprocess_sandbox.rs — env_clear() + SAFE_ENV_VARS'
      },
      {
        key: 'security_headers',
        impl: 'middleware.rs — security_headers()'
      },
      {
        key: 'wire_hmac_auth',
        impl: 'peer.rs — hmac_sign() + hmac_verify()'
      },
      {
        key: 'request_id_tracking',
        impl: 'middleware.rs — request_logging()'
      }
    ],

    configurableFeatures: [
      {
        key: 'rate_limiter',
        valueKey: 'rate_limiter'
      },
      {
        key: 'websocket_limits',
        valueKey: 'websocket_limits'
      },
      {
        key: 'wasm_sandbox',
        valueKey: 'wasm_sandbox'
      },
      {
        key: 'auth',
        valueKey: 'auth'
      }
    ],

    monitoringFeatures: [
      {
        key: 'audit_trail',
        valueKey: 'audit_trail'
      },
      {
        key: 'taint_translation',
        valueKey: 'taint_tracking'
      },
      {
        key: 'manifest_signing',
        valueKey: 'manifest_signing'
      }
    ],

    // Translation helper methods
    getFeatureName(feature) {
      const keyMap = {
        'path_traversal': 'settings.security.path_traversal_prevention',
        'ssrf_protection': 'settings.security.ssrf_protection',
        'capability_system': 'settings.security.capability_based_access_control',
        'privilege_escalation_prevention': 'settings.security.privilege_escalation_prevention',
        'subprocess_isolation': 'settings.security.subprocess_environment_isolation',
        'security_headers': 'settings.security.security_headers',
        'wire_hmac_auth': 'settings.security.wire_protocol_authentication',
        'request_id_tracking': 'settings.security.request_id_tracking',
        'rate_limiter': 'settings.security.api_rate_limiting',
        'websocket_limits': 'settings.security.websocket_limits',
        'wasm_sandbox': 'settings.security.wasm_dual_metering',
        'auth': 'settings.security.bearer_token_authentication',
        'audit_trail': 'settings.security.merkle_audit_trail',
        'taint_translation': 'settings.security.information_flow_taint_tracking',
        'manifest_signing': 'settings.security.ed25519_manifest_signing'
      };
      const translationKey = keyMap[feature.key] || feature.key;
      return typeof window.i18n !== 'undefined' ? window.i18n.t(translationKey) : feature.key;
    },

    getFeatureDescription(feature) {
      const descKeyMap = {
        'path_traversal': 'settings.security.path_traversal_desc',
        'ssrf_protection': 'settings.security.ssrf_desc',
        'capability_system': 'settings.security.capability_desc',
        'privilege_escalation_prevention': 'settings.security.privilege_escalation_desc',
        'subprocess_isolation': 'settings.security.subprocess_desc',
        'security_headers': 'settings.security.security_headers_desc',
        'wire_hmac_auth': 'settings.security.wire_auth_desc',
        'request_id_tracking': 'settings.security.request_id_desc',
        'rate_limiter': 'settings.security.rate_limiting_desc',
        'websocket_limits': 'settings.security.websocket_desc',
        'wasm_sandbox': 'settings.security.wasm_desc',
        'auth': 'settings.security.bearer_desc',
        'audit_trail': 'settings.security.merkle_desc',
        'taint_translation': 'settings.security.taint_desc',
        'manifest_signing': 'settings.security.signing_desc'
      };
      const translationKey = descKeyMap[feature.key] || feature.key + '_desc';
      return typeof window.i18n !== 'undefined' ? window.i18n.t(translationKey) : '';
    },

    getFeatureThreat(feature) {
      const threatKeyMap = {
        'path_traversal': 'settings.security.path_traversal_threat',
        'ssrf_protection': 'settings.security.ssrf_threat',
        'capability_system': 'settings.security.capability_threat',
        'privilege_escalation_prevention': 'settings.security.privilege_escalation_threat',
        'subprocess_isolation': 'settings.security.subprocess_threat',
        'security_headers': 'settings.security.security_headers_threat',
        'wire_hmac_auth': 'settings.security.wire_auth_threat',
        'request_id_tracking': 'settings.security.request_id_threat'
      };
      const translationKey = threatKeyMap[feature.key] || '';
      return typeof window.i18n !== 'undefined' ? window.i18n.t(translationKey) : '';
    },

    getFeatureConfigHint(feature) {
      const hintKeyMap = {
        'rate_limiter': 'settings.security.rate_limiting_hint',
        'websocket_limits': 'settings.security.websocket_hint',
        'wasm_sandbox': 'settings.security.wasm_hint',
        'auth': 'settings.security.bearer_hint',
        'audit_trail': 'settings.security.merkle_hint',
        'taint_translation': 'settings.security.taint_hint',
        'manifest_signing': 'settings.security.signing_hint'
      };
      const translationKey = hintKeyMap[feature.key] || '';
      return typeof window.i18n !== 'undefined' ? window.i18n.t(translationKey) : feature.configHint || '';
    },

    providerAuthClass(p) {
      if (p.auth_status === 'configured') return 'auth-configured';
      if (p.auth_status === 'not_set' || p.auth_status === 'missing') return 'auth-not-set';
      return 'auth-no-key';
    },

    providerAuthText(p) {
      if (p.auth_status === 'configured') {
        return typeof window.i18n !== 'undefined' ? window.i18n.t('settings.configured') : 'Configured';
      }
      if (p.auth_status === 'not_set' || p.auth_status === 'missing') {
        return typeof window.i18n !== 'undefined' ? window.i18n.t('settings.not_set') : 'Not Set';
      }
      return typeof window.i18n !== 'undefined' ? window.i18n.t('settings.no_key_needed') : 'No Key Needed';
    },

    // -- Peers state --
    peers: [],
    peersLoading: false,
    peersLoadError: '',
    _peerPollTimer: null,

    // -- Migration state --
    migStep: 'intro',
    detecting: false,
    scanning: false,
    migrating: false,
    sourcePath: '',
    targetPath: '',
    scanResult: null,
    migResult: null,

    // -- Settings load --
    async loadSettings() {
      this.loading = true;
      this.loadError = '';
      try {
        await Promise.all([
          this.loadSysInfo(),
          this.loadUsage(),
          this.loadTools(),
          this.loadConfig(),
          this.loadProviders(),
          this.loadModels()
        ]);
      } catch(e) {
        this.loadError = e.message || 'Could not load settings.';
      }
      this.loading = false;
    },

    async loadData() { return this.loadSettings(); },

    async loadSysInfo() {
      try {
        var ver = await OpenFangAPI.get('/api/version');
        var status = await OpenFangAPI.get('/api/status');
        this.sysInfo = {
          version: ver.version || '-',
          platform: ver.platform || '-',
          arch: ver.arch || '-',
          uptime_seconds: status.uptime_seconds || 0,
          agent_count: status.agent_count || 0,
          default_provider: status.default_provider || '-',
          default_model: status.default_model || '-'
        };
      } catch(e) { throw e; }
    },

    async loadUsage() {
      try {
        var data = await OpenFangAPI.get('/api/usage');
        this.usageData = data.agents || [];
      } catch(e) { this.usageData = []; }
    },

    async loadTools() {
      try {
        var data = await OpenFangAPI.get('/api/tools');
        this.tools = data.tools || [];
      } catch(e) { this.tools = []; }
    },

    async loadConfig() {
      try {
        this.config = await OpenFangAPI.get('/api/config');
      } catch(e) { this.config = {}; }
    },

    async loadProviders() {
      try {
        var data = await OpenFangAPI.get('/api/providers');
        this.providers = data.providers || [];
        for (var i = 0; i < this.providers.length; i++) {
          var p = this.providers[i];
          if (p.is_local && p.base_url && !this.providerUrlInputs[p.id]) {
            this.providerUrlInputs[p.id] = p.base_url;
          }
        }
      } catch(e) { this.providers = []; }
    },

    async loadModels() {
      try {
        var data = await OpenFangAPI.get('/api/models');
        this.models = data.models || [];
      } catch(e) { this.models = []; }
    },

    async addCustomModel() {
      var id = this.customModelId.trim();
      if (!id) return;
      this.customModelStatus = 'Adding...';
      try {
        await OpenFangAPI.post('/api/models/custom', {
          id: id,
          provider: this.customModelProvider || 'openrouter',
          context_window: this.customModelContext || 128000,
          max_output_tokens: this.customModelMaxOutput || 8192,
        });
        this.customModelStatus = 'Added!';
        this.customModelId = '';
        this.showCustomModelForm = false;
        await this.loadModels();
      } catch(e) {
        this.customModelStatus = 'Error: ' + (e.message || 'Failed');
      }
    },

    async loadConfigSchema() {
      try {
        var results = await Promise.all([
          OpenFangAPI.get('/api/config/schema').catch(function() { return {}; }),
          OpenFangAPI.get('/api/config')
        ]);
        this.configSchema = results[0].sections || null;
        this.configValues = results[1] || {};
      } catch(e) { /* silent */ }
    },

    isConfigDirty(section, field) {
      return this.configDirty[section + '.' + field] === true;
    },

    markConfigDirty(section, field) {
      this.configDirty[section + '.' + field] = true;
    },

    async saveConfigField(section, field, value) {
      var key = section + '.' + field;
      this.configSaving[key] = true;
      try {
        await OpenFangAPI.post('/api/config/set', { path: key, value: value });
        this.configDirty[key] = false;
        OpenFangToast.success('Saved ' + key);
      } catch(e) {
        OpenFangToast.error('Failed to save: ' + e.message);
      }
      this.configSaving[key] = false;
    },

    get filteredTools() {
      var q = this.toolSearch.toLowerCase().trim();
      if (!q) return this.tools;
      return this.tools.filter(function(t) {
        return t.name.toLowerCase().indexOf(q) !== -1 ||
               (t.description || '').toLowerCase().indexOf(q) !== -1;
      });
    },

    get filteredModels() {
      var self = this;
      return this.models.filter(function(m) {
        if (self.modelProviderFilter && m.provider !== self.modelProviderFilter) return false;
        if (self.modelTierFilter && m.tier !== self.modelTierFilter) return false;
        if (self.modelSearch) {
          var q = self.modelSearch.toLowerCase();
          if (m.id.toLowerCase().indexOf(q) === -1 &&
              (m.display_name || '').toLowerCase().indexOf(q) === -1) return false;
        }
        return true;
      });
    },

    get uniqueProviderNames() {
      var seen = {};
      this.models.forEach(function(m) { seen[m.provider] = true; });
      return Object.keys(seen).sort();
    },

    get uniqueTiers() {
      var seen = {};
      this.models.forEach(function(m) { if (m.tier) seen[m.tier] = true; });
      return Object.keys(seen).sort();
    },

    providerAuthClass(p) {
      if (p.auth_status === 'configured') return 'auth-configured';
      if (p.auth_status === 'not_set' || p.auth_status === 'missing') return 'auth-not-set';
      return 'auth-no-key';
    },

    providerAuthText(p) {
      if (p.auth_status === 'configured') return 'Configured';
      if (p.auth_status === 'not_set' || p.auth_status === 'missing') return 'Not Set';
      return 'No Key Needed';
    },

    providerCardClass(p) {
      if (p.auth_status === 'configured') return 'configured';
      if (p.auth_status === 'not_set' || p.auth_status === 'missing') return 'not-configured';
      return 'no-key';
    },

    tierBadgeClass(tier) {
      if (!tier) return '';
      var t = tier.toLowerCase();
      if (t === 'frontier') return 'tier-frontier';
      if (t === 'smart') return 'tier-smart';
      if (t === 'balanced') return 'tier-balanced';
      if (t === 'fast') return 'tier-fast';
      return '';
    },

    formatCost(cost) {
      if (!cost && cost !== 0) return '-';
      return '$' + cost.toFixed(4);
    },

    formatContext(ctx) {
      if (!ctx) return '-';
      if (ctx >= 1000000) return (ctx / 1000000).toFixed(1) + 'M';
      if (ctx >= 1000) return Math.round(ctx / 1000) + 'K';
      return String(ctx);
    },

    formatUptime(secs) {
      if (!secs) return '-';
      var h = Math.floor(secs / 3600);
      var m = Math.floor((secs % 3600) / 60);
      var s = secs % 60;
      if (h > 0) return h + 'h ' + m + 'm';
      if (m > 0) return m + 'm ' + s + 's';
      return s + 's';
    },

    async saveProviderKey(provider) {
      var key = this.providerKeyInputs[provider.id];
      if (!key || !key.trim()) { OpenFangToast.error('Please enter an API key'); return; }
      try {
        await OpenFangAPI.post('/api/providers/' + encodeURIComponent(provider.id) + '/key', { key: key.trim() });
        OpenFangToast.success('API key saved for ' + provider.display_name);
        this.providerKeyInputs[provider.id] = '';
        await this.loadProviders();
        await this.loadModels();
      } catch(e) {
        OpenFangToast.error('Failed to save key: ' + e.message);
      }
    },

    async removeProviderKey(provider) {
      try {
        await OpenFangAPI.del('/api/providers/' + encodeURIComponent(provider.id) + '/key');
        OpenFangToast.success('API key removed for ' + provider.display_name);
        await this.loadProviders();
        await this.loadModels();
      } catch(e) {
        OpenFangToast.error('Failed to remove key: ' + e.message);
      }
    },

    async startCopilotOAuth() {
      this.copilotOAuth.polling = true;
      this.copilotOAuth.userCode = '';
      try {
        var resp = await OpenFangAPI.post('/api/providers/github-copilot/oauth/start', {});
        this.copilotOAuth.userCode = resp.user_code;
        this.copilotOAuth.verificationUri = resp.verification_uri;
        this.copilotOAuth.pollId = resp.poll_id;
        this.copilotOAuth.interval = resp.interval || 5;
        window.open(resp.verification_uri, '_blank');
        this.pollCopilotOAuth();
      } catch(e) {
        OpenFangToast.error('Failed to start Copilot login: ' + e.message);
        this.copilotOAuth.polling = false;
      }
    },

    pollCopilotOAuth() {
      var self = this;
      setTimeout(async function() {
        if (!self.copilotOAuth.pollId) return;
        try {
          var resp = await OpenFangAPI.get('/api/providers/github-copilot/oauth/poll/' + self.copilotOAuth.pollId);
          if (resp.status === 'complete') {
            OpenFangToast.success('GitHub Copilot authenticated successfully!');
            self.copilotOAuth = { polling: false, userCode: '', verificationUri: '', pollId: '', interval: 5 };
            await self.loadProviders();
            await self.loadModels();
          } else if (resp.status === 'pending') {
            if (resp.interval) self.copilotOAuth.interval = resp.interval;
            self.pollCopilotOAuth();
          } else if (resp.status === 'expired') {
            OpenFangToast.error('Device code expired. Please try again.');
            self.copilotOAuth = { polling: false, userCode: '', verificationUri: '', pollId: '', interval: 5 };
          } else if (resp.status === 'denied') {
            OpenFangToast.error('Access denied by user.');
            self.copilotOAuth = { polling: false, userCode: '', verificationUri: '', pollId: '', interval: 5 };
          } else {
            OpenFangToast.error('OAuth error: ' + (resp.error || resp.status));
            self.copilotOAuth = { polling: false, userCode: '', verificationUri: '', pollId: '', interval: 5 };
          }
        } catch(e) {
          OpenFangToast.error('Poll error: ' + e.message);
          self.copilotOAuth = { polling: false, userCode: '', verificationUri: '', pollId: '', interval: 5 };
        }
      }, self.copilotOAuth.interval * 1000);
    },

    async testProvider(provider) {
      this.providerTesting[provider.id] = true;
      this.providerTestResults[provider.id] = null;
      try {
        var result = await OpenFangAPI.post('/api/providers/' + encodeURIComponent(provider.id) + '/test', {});
        this.providerTestResults[provider.id] = result;
        if (result.status === 'ok') {
          OpenFangToast.success(provider.display_name + ' connected (' + (result.latency_ms || '?') + 'ms)');
        } else {
          OpenFangToast.error(provider.display_name + ': ' + (result.error || 'Connection failed'));
        }
      } catch(e) {
        this.providerTestResults[provider.id] = { status: 'error', error: e.message };
        OpenFangToast.error('Test failed: ' + e.message);
      }
      this.providerTesting[provider.id] = false;
    },

    async saveProviderUrl(provider) {
      var url = this.providerUrlInputs[provider.id];
      if (!url || !url.trim()) { OpenFangToast.error('Please enter a base URL'); return; }
      url = url.trim();
      if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        OpenFangToast.error('URL must start with http:// or https://'); return;
      }
      this.providerUrlSaving[provider.id] = true;
      try {
        var result = await OpenFangAPI.put('/api/providers/' + encodeURIComponent(provider.id) + '/url', { base_url: url });
        if (result.reachable) {
          OpenFangToast.success(provider.display_name + ' URL saved &mdash; reachable (' + (result.latency_ms || '?') + 'ms)');
        } else {
          OpenFangToast.warning(provider.display_name + ' URL saved but not reachable');
        }
        await this.loadProviders();
      } catch(e) {
        OpenFangToast.error('Failed to save URL: ' + e.message);
      }
      this.providerUrlSaving[provider.id] = false;
    },

    // -- Security methods --
    async loadSecurity() {
      this.secLoading = true;
      try {
        this.securityData = await OpenFangAPI.get('/api/security');
      } catch(e) {
        this.securityData = null;
      }
      this.secLoading = false;
    },

    isActive(key) {
      if (!this.securityData) return true;
      var core = this.securityData.core_protections || {};
      if (core[key] !== undefined) return core[key];
      return true;
    },

    getConfigValue(key) {
      if (!this.securityData) return null;
      var cfg = this.securityData.configurable || {};
      return cfg[key] || null;
    },

    getMonitoringValue(key) {
      if (!this.securityData) return null;
      var mon = this.securityData.monitoring || {};
      return mon[key] || null;
    },

    formatConfigValue(feature) {
      var val = this.getConfigValue(feature.valueKey);
      if (!val) return feature.configHint;
      switch (feature.valueKey) {
        case 'rate_limiter':
          return 'Algorithm: ' + (val.algorithm || 'GCRA') + ' | ' + (val.tokens_per_minute || 500) + ' tokens/min per IP';
        case 'websocket_limits':
          return 'Max ' + (val.max_per_ip || 5) + ' conn/IP | ' + Math.round((val.idle_timeout_secs || 1800) / 60) + 'min idle timeout | ' + Math.round((val.max_message_size || 65536) / 1024) + 'KB max msg';
        case 'wasm_sandbox':
          return 'Fuel: ' + (val.fuel_metering ? 'ON' : 'OFF') + ' | Epoch: ' + (val.epoch_interruption ? 'ON' : 'OFF') + ' | Timeout: ' + (val.default_timeout_secs || 30) + 's';
        case 'auth':
          return 'Mode: ' + (val.mode || 'unknown') + (val.api_key_set ? ' (key configured)' : ' (no key set)');
        default:
          return feature.configHint;
      }
    },

    formatMonitoringValue(feature) {
      var val = this.getMonitoringValue(feature.valueKey);
      if (!val) return feature.configHint;
      switch (feature.valueKey) {
        case 'audit_trail':
          return (val.enabled ? 'Active' : 'Disabled') + ' | ' + (val.algorithm || 'SHA-256') + ' | ' + (val.entry_count || 0) + ' entries logged';
        case 'taint_tracking':
          var labels = val.tracked_labels || [];
          return (val.enabled ? 'Active' : 'Disabled') + ' | Tracking: ' + labels.join(', ');
        case 'manifest_signing':
          return 'Algorithm: ' + (val.algorithm || 'Ed25519') + ' | ' + (val.available ? 'Available' : 'Not available');
        default:
          return feature.configHint;
      }
    },

    async verifyAuditChain() {
      this.verifyingChain = true;
      this.chainResult = null;
      try {
        var res = await OpenFangAPI.get('/api/audit/verify');
        this.chainResult = res;
      } catch(e) {
        this.chainResult = { valid: false, error: e.message };
      }
      this.verifyingChain = false;
    },

    // -- Peers methods --
    async loadPeers() {
      this.peersLoading = true;
      this.peersLoadError = '';
      try {
        var data = await OpenFangAPI.get('/api/peers');
        this.peers = (data.peers || []).map(function(p) {
          return {
            node_id: p.node_id,
            node_name: p.node_name,
            address: p.address,
            state: p.state,
            agent_count: (p.agents || []).length,
            protocol_version: p.protocol_version || 1
          };
        });
      } catch(e) {
        this.peers = [];
        this.peersLoadError = e.message || 'Could not load peers.';
      }
      this.peersLoading = false;
    },

    startPeerPolling() {
      var self = this;
      this.stopPeerPolling();
      this._peerPollTimer = setInterval(async function() {
        if (self.tab !== 'network') { self.stopPeerPolling(); return; }
        try {
          var data = await OpenFangAPI.get('/api/peers');
          self.peers = (data.peers || []).map(function(p) {
            return {
              node_id: p.node_id,
              node_name: p.node_name,
              address: p.address,
              state: p.state,
              agent_count: (p.agents || []).length,
              protocol_version: p.protocol_version || 1
            };
          });
        } catch(e) { /* silent */ }
      }, 15000);
    },

    stopPeerPolling() {
      if (this._peerPollTimer) { clearInterval(this._peerPollTimer); this._peerPollTimer = null; }
    },

    // -- Migration methods --
    async autoDetect() {
      this.detecting = true;
      try {
        var data = await OpenFangAPI.get('/api/migrate/detect');
        if (data.detected && data.scan) {
          this.sourcePath = data.path;
          this.scanResult = data.scan;
          this.migStep = 'preview';
        } else {
          this.migStep = 'not_found';
        }
      } catch(e) {
        this.migStep = 'not_found';
      }
      this.detecting = false;
    },

    async scanPath() {
      if (!this.sourcePath) return;
      this.scanning = true;
      try {
        var data = await OpenFangAPI.post('/api/migrate/scan', { path: this.sourcePath });
        if (data.error) {
          OpenFangToast.error('Scan error: ' + data.error);
          this.scanning = false;
          return;
        }
        this.scanResult = data;
        this.migStep = 'preview';
      } catch(e) {
        OpenFangToast.error('Scan failed: ' + e.message);
      }
      this.scanning = false;
    },

    async runMigration(dryRun) {
      this.migrating = true;
      try {
        var target = this.targetPath;
        if (!target) target = '';
        var data = await OpenFangAPI.post('/api/migrate', {
          source: 'openclaw',
          source_dir: this.sourcePath || (this.scanResult ? this.scanResult.path : ''),
          target_dir: target,
          dry_run: dryRun
        });
        this.migResult = data;
        this.migStep = 'result';
      } catch(e) {
        this.migResult = { status: 'failed', error: e.message };
        this.migStep = 'result';
      }
      this.migrating = false;
    },

    destroy() {
      this.stopPeerPolling();
    }
  };
}
