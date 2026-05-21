<template>
  <main class="login-shell">
    <section class="access-panel">
      <div class="brand-lock">
        <Icon icon="fluent:mail-read-20-regular" width="28" height="28" />
      </div>

      <div class="title-block">
        <span class="eyebrow">Private mail console</span>
        <h1>{{ settingStore.settings.title }}</h1>
      </div>

      <el-input
          v-model="form.key"
          class="key-input"
          type="password"
          show-password
          placeholder="Access key"
          autocomplete="current-password"
          @keyup.enter="submit"
      >
        <template #prefix>
          <Icon icon="fluent:lock-closed-16-regular" width="18" height="18" />
        </template>
      </el-input>

      <el-button class="unlock-btn" type="primary" :loading="loginLoading" @click="submit">
        <Icon v-if="!loginLoading" icon="fluent:lock-closed-16-regular" width="18" height="18" />
        <span>Unlock mailbox</span>
      </el-button>
    </section>

    <a v-show="settingStore.settings.projectLink" class="github" href="https://github.com/maillab/cloud-mail">
      <Icon icon="mingcute:github-line" width="20" height="20" />
    </a>
  </main>
</template>

<script setup>
import router from "@/router";
import { reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { loginWithKey } from "@/request/login.js";
import { loginUserInfo } from "@/request/my.js";
import { useAccountStore } from "@/store/account.js";
import { useSettingStore } from "@/store/setting.js";
import { useUiStore } from "@/store/ui.js";
import { useUserStore } from "@/store/user.js";
import { permsToRouter } from "@/perm/perm.js";

const accountStore = useAccountStore();
const userStore = useUserStore();
const uiStore = useUiStore();
const settingStore = useSettingStore();
const loginLoading = ref(false);

const form = reactive({
  key: ''
});

const submit = () => {
  const key = form.key.trim();

  if (!key) {
    ElMessage({
      message: 'Access key cannot be empty',
      type: 'error',
      plain: true,
    });
    return;
  }

  loginLoading.value = true;
  loginWithKey(key).then(async data => {
    await saveToken(data.token);
  }).finally(() => {
    loginLoading.value = false;
  });
};

async function saveToken(token) {
  localStorage.setItem('token', token);
  const user = await loginUserInfo();
  accountStore.currentAccountId = user.account.accountId;
  accountStore.currentAccount = user.account;
  userStore.user = user;
  const routers = permsToRouter(user.permKeys);
  routers.forEach(routerData => {
    router.addRoute('layout', routerData);
  });
  await router.replace({ name: 'layout' });
  uiStore.showNotice();
}
</script>

<style lang="scss" scoped>
.login-shell {
  position: relative;
  min-height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  background:
      linear-gradient(rgba(20, 184, 166, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(20, 184, 166, 0.05) 1px, transparent 1px),
      radial-gradient(circle at 50% 18%, rgba(45, 212, 191, 0.16), transparent 34%),
      linear-gradient(145deg, #061314 0%, #091f22 46%, #030708 100%);
  background-size: 42px 42px, 42px 42px, 100% 100%, 100% 100%;
  color: #ecfeff;
}

.login-shell::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(120deg, transparent 0%, rgba(45, 212, 191, 0.08) 46%, transparent 68%);
}

.access-panel {
  position: relative;
  z-index: 1;
  width: min(100%, 420px);
  padding: 34px;
  border: 1px solid rgba(94, 234, 212, 0.18);
  border-radius: 8px;
  background: rgba(8, 24, 27, 0.84);
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.44), inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(16px);

  @media (max-width: 480px) {
    padding: 26px 20px;
  }
}

.brand-lock {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border-radius: 8px;
  color: #99f6e4;
  background: rgba(20, 184, 166, 0.12);
  border: 1px solid rgba(94, 234, 212, 0.18);
}

.title-block {
  margin-bottom: 24px;

  .eyebrow {
    display: block;
    margin-bottom: 6px;
    color: #f5c77e;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    color: #ecfeff;
    font-size: 28px;
    line-height: 1.18;
    font-weight: 760;
    word-break: break-word;
  }
}

.key-input {
  height: 46px;
  margin-bottom: 16px;

  :deep(.el-input__wrapper) {
    height: 46px;
    border-radius: 8px;
    background: rgba(2, 8, 10, 0.72);
    box-shadow: 0 0 0 1px rgba(94, 234, 212, 0.16);
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px rgba(45, 212, 191, 0.78), 0 0 0 4px rgba(45, 212, 191, 0.12);
  }

  :deep(.el-input__inner) {
    color: #ecfeff;
  }

  :deep(.el-input__prefix),
  :deep(.el-input__suffix) {
    color: #7dd3c7;
  }
}

.unlock-btn {
  width: 100%;
  height: 46px;
  gap: 8px;
  border: 0;
  border-radius: 8px;
  color: #041110;
  font-weight: 760;
  background: linear-gradient(135deg, #5eead4 0%, #14b8a6 58%, #0f766e 100%);
  box-shadow: 0 14px 38px rgba(20, 184, 166, 0.28);
}

.unlock-btn:hover,
.unlock-btn:focus {
  color: #041110;
  filter: brightness(1.05);
}

.github {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #99f6e4;
  background: rgba(8, 24, 27, 0.82);
  border: 1px solid rgba(94, 234, 212, 0.18);
}
</style>
