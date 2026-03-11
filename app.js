(function () {
  'use strict';

  var EXT_ID = '@thibautrey/chatons-extension-homeassistant';

  if (window.chatonExtensionComponents) {
    window.chatonExtensionComponents.ensureStyles();
  }

  // DOM refs
  var haUrlInput = document.getElementById('haUrl');
  var haTokenInput = document.getElementById('haToken');
  var saveBtn = document.getElementById('saveBtn');
  var testBtn = document.getElementById('testBtn');
  var statusMsg = document.getElementById('statusMsg');
  var infoCard = document.getElementById('infoCard');
  var instanceInfo = document.getElementById('instanceInfo');

  // ---------------------------------------------------------------------------
  // Config persistence
  // ---------------------------------------------------------------------------

  function loadConfig() {
    return window.chaton.extensionStorageKvGet(EXT_ID, 'ha_config')
      .then(function (result) {
        if (result && result.ok && result.data) {
          haUrlInput.value = result.data.url || '';
          haTokenInput.value = result.data.token || '';
          if (result.data.url && result.data.token) {
            fetchInstanceInfo(result.data.url, result.data.token);
          }
        }
      });
  }

  function saveConfig() {
    var url = haUrlInput.value.trim().replace(/\/+$/, '');
    var token = haTokenInput.value.trim();
    if (!url || !token) {
      showStatus('Please fill in both fields.', 'error');
      return;
    }
    window.chaton.extensionStorageKvSet(EXT_ID, 'ha_config', { url: url, token: token })
      .then(function () {
        showStatus('Configuration saved.', 'success');
        window.chaton.extensionHostCall(EXT_ID, 'notifications.notify', {
          title: 'Home Assistant',
          body: 'Configuration saved successfully.',
        });
        fetchInstanceInfo(url, token);
      });
  }

  function getConfig() {
    return window.chaton.extensionStorageKvGet(EXT_ID, 'ha_config')
      .then(function (result) {
        if (result && result.ok && result.data && result.data.url && result.data.token) {
          return result.data;
        }
        return null;
      });
  }

  // ---------------------------------------------------------------------------
  // HA API helpers
  // ---------------------------------------------------------------------------

  function haFetch(config, path, options) {
    var url = config.url.replace(/\/+$/, '') + path;
    var opts = Object.assign({
      headers: {
        'Authorization': 'Bearer ' + config.token,
        'Content-Type': 'application/json',
      },
    }, options || {});
    return fetch(url, opts).then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (body) {
          throw new Error('HTTP ' + resp.status + ': ' + body);
        });
      }
      return resp.json();
    });
  }

  function testConnection() {
    var url = haUrlInput.value.trim().replace(/\/+$/, '');
    var token = haTokenInput.value.trim();
    if (!url || !token) {
      showStatus('Please fill in both fields.', 'error');
      return;
    }
    showStatus('Testing connection...', '');
    haFetch({ url: url, token: token }, '/api/')
      .then(function (data) {
        showStatus('Connected! Message: ' + data.message, 'success');
        fetchInstanceInfo(url, token);
      })
      .catch(function (err) {
        showStatus('Connection failed: ' + err.message, 'error');
        infoCard.style.display = 'none';
      });
  }

  function fetchInstanceInfo(url, token) {
    haFetch({ url: url, token: token }, '/api/config')
      .then(function (data) {
        infoCard.style.display = '';
        instanceInfo.innerHTML = [
          infoRow('Name', data.location_name || 'N/A'),
          infoRow('Version', data.version || 'N/A'),
          infoRow('Time Zone', data.time_zone || 'N/A'),
          infoRow('Unit System', (data.unit_system && data.unit_system.temperature) || 'N/A'),
        ].join('');
      })
      .catch(function () {
        infoCard.style.display = 'none';
      });
  }

  function infoRow(label, value) {
    return '<div class="info-row"><span class="info-label">' + label + '</span><span>' + escapeHtml(String(value)) + '</span></div>';
  }

  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.className = 'status-msg' + (type ? ' ' + type : '');
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Requirement sheet builder
  // ---------------------------------------------------------------------------

  function buildRequirementSheetHtml() {
    return [
      '<!DOCTYPE html>',
      '<html><head><meta charset="utf-8">',
      '<style>',
      '  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif;',
      '         padding: 20px 24px; margin: 0;',
      '         background: var(--chaton-ui-background, #f5f6f8);',
      '         color: var(--chaton-ui-foreground, #1a1b22); font-size: 14px; }',
      '  .field { margin-bottom: 14px; }',
      '  label { display: block; font-weight: 500; font-size: 13px; margin-bottom: 6px; }',
      '  input { width: 100%; box-sizing: border-box; padding: 8px 12px;',
      '          border-radius: 8px; border: 1px solid var(--chaton-ui-border, #d6d9e2);',
      '          background: var(--chaton-ui-card, #fff); color: inherit; font: inherit; }',
      '  input:focus { outline: 2px solid var(--chaton-ui-ring, #6b7280); outline-offset: 2px; }',
      '  .actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }',
      '  button { font: inherit; font-size: 13px; font-weight: 500; padding: 8px 18px;',
      '           border-radius: 8px; cursor: pointer;',
      '           border: 1px solid var(--chaton-ui-border, #d6d9e2);',
      '           background: var(--chaton-ui-card, #fff); color: inherit; }',
      '  .btn-primary { background: var(--chaton-ui-primary, hsl(220 7% 32%));',
      '                 color: var(--chaton-ui-primary-foreground, #fff);',
      '                 border-color: var(--chaton-ui-primary, hsl(220 7% 32%)); }',
      '  .help { font-size: 12px; color: var(--chaton-ui-muted-foreground, #6b7280); margin-top: 4px; }',
      '  @media (prefers-color-scheme: dark) {',
      '    body { background: hsl(222 14% 12%); color: hsl(210 20% 90%); }',
      '    input { background: hsl(222 13% 17%); border-color: hsl(222 10% 24%); }',
      '    button { background: hsl(222 13% 17%); border-color: hsl(222 10% 24%); }',
      '  }',
      '</style>',
      '</head><body>',
      '  <p style="margin-top:0">Configure your Home Assistant connection to use this tool.</p>',
      '  <div class="field">',
      '    <label for="rs-url">Home Assistant URL</label>',
      '    <input id="rs-url" type="url" placeholder="http://homeassistant.local:8123" />',
      '  </div>',
      '  <div class="field">',
      '    <label for="rs-token">Long-Lived Access Token</label>',
      '    <input id="rs-token" type="password" placeholder="Enter your access token" />',
      '    <div class="help">Profile &rarr; Long-Lived Access Tokens &rarr; Create Token</div>',
      '  </div>',
      '  <div class="actions">',
      '    <button onclick="window.chaton.requirementSheet.dismiss()">Cancel</button>',
      '    <button class="btn-primary" onclick="saveAndConfirm()">Save &amp; Connect</button>',
      '  </div>',
      '  <script>',
      '    function saveAndConfirm() {',
      '      var url = document.getElementById("rs-url").value.trim().replace(/\\/+$/, "");',
      '      var token = document.getElementById("rs-token").value.trim();',
      '      if (!url || !token) return;',
      '      // Store via postMessage to parent, then confirm',
      '      window.parent.postMessage({',
      '        type: "chaton.extension.requirementSheet.saveConfig",',
      '        payload: { url: url, token: token }',
      '      }, "*");',
      '      window.chaton.requirementSheet.confirm();',
      '    }',
      '  </script>',
      '</body></html>',
    ].join('\n');
  }

  // Listen for config saves from the requirement sheet iframe
  window.addEventListener('message', function (event) {
    var data = event && event.data;
    if (!data) return;

    if (data.type === 'chaton.extension.requirementSheet.saveConfig' && data.payload) {
      window.chaton.extensionStorageKvSet(EXT_ID, 'ha_config', data.payload);
    }
  });

  // ---------------------------------------------------------------------------
  // LLM Tool handlers
  // ---------------------------------------------------------------------------

  function returnError(callId, code, message, includeSheet) {
    var error = { code: code, message: message };
    if (includeSheet) {
      error.requirementSheet = {
        title: 'Configure Home Assistant',
        html: buildRequirementSheetHtml(),
      };
    }
    window.parent.postMessage({
      type: 'chaton.extension.apiCallResponse',
      callId: callId,
      result: { ok: false, error: error },
    }, '*');
  }

  function returnSuccess(callId, data) {
    window.parent.postMessage({
      type: 'chaton.extension.apiCallResponse',
      callId: callId,
      result: { ok: true, data: data },
    }, '*');
  }

  // Tool: list entities
  function handleListEntities(callId, payload) {
    getConfig().then(function (config) {
      if (!config) {
        returnError(callId, 'unauthorized', 'Home Assistant not configured. Please set your URL and token in the sheet above.', true);
        return;
      }
      haFetch(config, '/api/states')
        .then(function (states) {
          var domain = payload && payload.domain;
          if (domain) {
            states = states.filter(function (s) {
              return s.entity_id.startsWith(domain + '.');
            });
          }
          // Return a compact summary
          var entities = states.map(function (s) {
            return {
              entity_id: s.entity_id,
              state: s.state,
              friendly_name: (s.attributes && s.attributes.friendly_name) || null,
            };
          });
          returnSuccess(callId, { count: entities.length, entities: entities });
        })
        .catch(function (err) {
          returnError(callId, 'internal', 'Failed to list entities: ' + err.message, false);
        });
    });
  }

  // Tool: get entity state
  function handleGetEntityState(callId, payload) {
    getConfig().then(function (config) {
      if (!config) {
        returnError(callId, 'unauthorized', 'Home Assistant not configured. Please set your URL and token in the sheet above.', true);
        return;
      }
      var entityId = payload && payload.entity_id;
      if (!entityId) {
        returnError(callId, 'invalid_args', 'entity_id is required.', false);
        return;
      }
      haFetch(config, '/api/states/' + encodeURIComponent(entityId))
        .then(function (state) {
          returnSuccess(callId, {
            entity_id: state.entity_id,
            state: state.state,
            attributes: state.attributes,
            last_changed: state.last_changed,
            last_updated: state.last_updated,
          });
        })
        .catch(function (err) {
          returnError(callId, 'not_found', 'Failed to get entity: ' + err.message, false);
        });
    });
  }

  // Tool: call service
  function handleCallService(callId, payload) {
    getConfig().then(function (config) {
      if (!config) {
        returnError(callId, 'unauthorized', 'Home Assistant not configured. Please set your URL and token in the sheet above.', true);
        return;
      }
      var service = payload && payload.service;
      var entityId = payload && payload.entity_id;
      if (!service || !entityId) {
        returnError(callId, 'invalid_args', 'service and entity_id are required.', false);
        return;
      }
      // Split domain.action
      var parts = service.split('.');
      if (parts.length !== 2) {
        returnError(callId, 'invalid_args', 'service must be in domain.action format (e.g. light.turn_on).', false);
        return;
      }
      var domain = parts[0];
      var action = parts[1];
      var body = Object.assign({ entity_id: entityId }, payload.service_data || {});
      haFetch(config, '/api/services/' + encodeURIComponent(domain) + '/' + encodeURIComponent(action), {
        method: 'POST',
        body: JSON.stringify(body),
      })
        .then(function (result) {
          // HA returns the affected entity states
          var summary = Array.isArray(result) ? result.map(function (s) {
            return { entity_id: s.entity_id, state: s.state };
          }) : result;
          returnSuccess(callId, { service: service, entity_id: entityId, result: summary });
        })
        .catch(function (err) {
          returnError(callId, 'internal', 'Service call failed: ' + err.message, false);
        });
    });
  }

  // Tool: get history
  function handleGetHistory(callId, payload) {
    getConfig().then(function (config) {
      if (!config) {
        returnError(callId, 'unauthorized', 'Home Assistant not configured. Please set your URL and token in the sheet above.', true);
        return;
      }
      var entityId = payload && payload.entity_id;
      if (!entityId) {
        returnError(callId, 'invalid_args', 'entity_id is required.', false);
        return;
      }
      var hours = Math.min(payload.hours || 24, 168);
      var startTime = new Date(Date.now() - hours * 3600 * 1000).toISOString();
      var path = '/api/history/period/' + encodeURIComponent(startTime) +
        '?filter_entity_id=' + encodeURIComponent(entityId) + '&minimal_response';

      haFetch(config, path)
        .then(function (result) {
          // HA returns [[state, state, ...]] - array of arrays per entity
          var history = (Array.isArray(result) && result[0]) || [];
          // Compact the response
          var entries = history.map(function (s) {
            return { state: s.state, last_changed: s.last_changed };
          });
          returnSuccess(callId, { entity_id: entityId, hours: hours, entries: entries, count: entries.length });
        })
        .catch(function (err) {
          returnError(callId, 'internal', 'Failed to get history: ' + err.message, false);
        });
    });
  }

  // ---------------------------------------------------------------------------
  // API call dispatcher
  // ---------------------------------------------------------------------------

  var toolHandlers = {
    homeassistant_list_entities: handleListEntities,
    homeassistant_get_entity_state: handleGetEntityState,
    homeassistant_call_service: handleCallService,
    homeassistant_get_history: handleGetHistory,
  };

  window.addEventListener('message', function (event) {
    var data = event && event.data;
    if (!data || data.type !== 'chaton.extension.apiCall') return;

    var handler = toolHandlers[data.apiName];
    if (handler) {
      handler(data.callId, data.payload || {});
    }
  });

  // ---------------------------------------------------------------------------
  // UI event listeners
  // ---------------------------------------------------------------------------

  saveBtn.addEventListener('click', saveConfig);
  testBtn.addEventListener('click', testConnection);

  // Init
  loadConfig();
})();
