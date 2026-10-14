<template>
  <VcBlade
    :title="isNew ? $t('NATIVE_PAYMENT_METHODS.DETAILS.NEW_TITLE') : stored.name"
    :subtitle="isNew ? undefined : stored.code"
    :toolbar-items="toolbar"
    :loading="loading"
    :modified="form.isModified.value"
    width="50%"
  >
    <VcContainer>
      <VcForm class="npm-form">
        <VcCard :header="$t('NATIVE_PAYMENT_METHODS.DETAILS.GENERAL')">
          <div class="npm-card">
            <VcRow class="tw-gap-4">
              <VcCol>
                <VcInput
                  v-model="item.code"
                  :label="$t('NATIVE_PAYMENT_METHODS.FIELDS.CODE')"
                  :hint="isNew ? $t('NATIVE_PAYMENT_METHODS.DETAILS.CODE_HINT') : undefined"
                  :disabled="!isNew"
                  :error-message="codeError"
                  required
                />
              </VcCol>
              <VcCol>
                <VcInput
                  v-model="item.name"
                  :label="$t('NATIVE_PAYMENT_METHODS.FIELDS.NAME')"
                  :error-message="item.name ? undefined : $t('NATIVE_PAYMENT_METHODS.DETAILS.REQUIRED')"
                  required
                />
              </VcCol>
            </VcRow>
            <VcSwitch
              v-model="item.isEnabled"
              :label="$t('NATIVE_PAYMENT_METHODS.FIELDS.IS_ENABLED')"
            />
            <VcTextarea
              v-model="item.description"
              :label="$t('NATIVE_PAYMENT_METHODS.FIELDS.DESCRIPTION')"
            />
          </div>
        </VcCard>
        <VcCard :header="$t('NATIVE_PAYMENT_METHODS.FIELDS.LOGO')">
          <div class="npm-card">
            <VcImageUpload
              :image="item.logoUrl ? { url: item.logoUrl, name: item.name } : undefined"
              :loading="uploading"
              accept=".png,.jpg,.jpeg,.svg"
              @upload="onUpload"
              @remove="item.logoUrl = null"
            />
            <VcHint>{{ $t("NATIVE_PAYMENT_METHODS.DETAILS.LOGO_HINT") }}</VcHint>
          </div>
        </VcCard>
      </VcForm>
    </VcContainer>
  </VcBlade>
</template>

<script setup lang="ts">
import { notification, useAsync, useBlade, useBladeForm, useLoading, usePermissions, type IBladeToolbar } from "@vc-shell/framework";
import {
  VcBlade,
  VcCard,
  VcCol,
  VcContainer,
  VcForm,
  VcHint,
  VcImageUpload,
  VcInput,
  VcRow,
  VcSwitch,
  VcTextarea,
} from "@vc-shell/framework/ui";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api, uploadAsset, type NativePaymentMethod } from "../api";

defineBlade({
  url: "/native-payment-method",
  name: "NativePaymentMethodDetails",
  permissions: ["NativePaymentMethods:read"],
});

const { t } = useI18n({ useScope: "global" });
const { param, callParent, replaceWith } = useBlade();
const { hasAccess } = usePermissions();

const isNew = computed(() => !param.value);
const item = ref<NativePaymentMethod>({ isEnabled: true });
const stored = ref<NativePaymentMethod>({});

// the server's rule (NativePaymentMethodValidator)
const CODE = /^[_0-9A-Za-z]+$/;
const codeError = computed(() => {
  if (!item.value.code) return t("NATIVE_PAYMENT_METHODS.DETAILS.REQUIRED");
  return CODE.test(item.value.code) ? undefined : t("NATIVE_PAYMENT_METHODS.DETAILS.CODE_INVALID");
});

const form = useBladeForm({
  data: item,
  canSaveOverride: computed(() => !codeError.value && !!item.value.name && hasAccess("NativePaymentMethods:create")),
  closeConfirmMessage: computed(() => t("NATIVE_PAYMENT_METHODS.DETAILS.CLOSE_CONFIRM")),
});

const { loading: loadLoading, action: load } = useAsync(async () => {
  item.value = isNew.value ? { isEnabled: true } : await api.get(param.value!);
  stored.value = { ...item.value };
  form.setBaseline();
});

const { loading: saveLoading, action: save } = useAsync(async () => {
  await api.save(item.value);
  notification.success(t("NATIVE_PAYMENT_METHODS.DETAILS.SAVED"));
  if (isNew.value) {
    // the server answers an empty 200: find the new method by its code
    const [, found] = await Promise.all([callParent("reload"), api.search({ codes: item.value.code! })]);
    const [created] = found.results ?? [];
    form.setBaseline();
    if (created?.id) await replaceWith({ name: "NativePaymentMethodDetails", param: created.id });
    return;
  }
  await callParent("reload");
  await load();
});

const loading = useLoading(loadLoading, saveLoading);

const uploading = ref(false);
async function onUpload(files: FileList) {
  const file = files[0];
  if (!file) return;
  uploading.value = true;
  try {
    item.value.logoUrl = await uploadAsset(file, "nativepaymentlogos");
  } catch (e) {
    notification.error((e as Error).message);
  } finally {
    uploading.value = false;
  }
}

const toolbar = ref<IBladeToolbar[]>([
  {
    id: "save",
    title: computed(() => t(isNew.value ? "NATIVE_PAYMENT_METHODS.TOOLBAR.CREATE" : "NATIVE_PAYMENT_METHODS.TOOLBAR.SAVE")),
    icon: "lucide-save",
    disabled: computed(() => !form.canSave.value),
    clickHandler: () => save(),
  },
  {
    id: "reset",
    title: t("NATIVE_PAYMENT_METHODS.TOOLBAR.RESET"),
    icon: "lucide-undo-2",
    disabled: computed(() => !form.isModified.value),
    clickHandler: () => form.revert(),
  },
  {
    id: "refresh",
    title: t("NATIVE_PAYMENT_METHODS.TOOLBAR.REFRESH"),
    icon: "lucide-refresh-cw",
    isVisible: computed(() => !isNew.value),
    clickHandler: () => load(),
  },
]);

load();
</script>

<style lang="scss">
.npm-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px 22px 36px;
}

.npm-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
</style>
