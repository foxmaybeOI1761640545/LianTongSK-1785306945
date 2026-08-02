<script setup>
import { computed, ref } from 'vue'
import DashboardHeader from './components/DashboardHeader.vue'
import KpiCard from './components/KpiCard.vue'
import PanelFrame from './components/PanelFrame.vue'
import TrafficTrendChart from './components/TrafficTrendChart.vue'
import ExperienceSignals from './components/ExperienceSignals.vue'
import RoamingFlowMap from './components/RoamingFlowMap.vue'
import OpportunityPanel from './components/OpportunityPanel.vue'
import HighValueRanking from './components/HighValueRanking.vue'
import RecentFocusList from './components/RecentFocusList.vue'
import ExperiencePathPanel from './components/ExperiencePathPanel.vue'
import PipelineStatus from './components/PipelineStatus.vue'
import ValuePanel from './components/ValuePanel.vue'
import CdrDetailDrawer from './components/CdrDetailDrawer.vue'
import { useDashboardData } from './composables/useDashboardData.js'
import { useDemoTour } from './composables/useDemoTour.js'

const { filters, dashboard, loading, error, setRange, setSegment, reload } = useDashboardData()
const selectedRecord = ref(null)
const manualActive = ref('')
let manualTimer = null

function highlight(section) {
  manualActive.value = section
  globalThis.clearTimeout(manualTimer)
  manualTimer = globalThis.setTimeout(() => { manualActive.value = '' }, 1800)
}

const tour = useDemoTour({
  onStep(step) {
    if (step === 'detail') selectedRecord.value = dashboard.value?.highValueRecords?.[0] ?? null
    else if (selectedRecord.value) selectedRecord.value = null
  },
})

const activeStep = computed(() => tour.activeStep.value || manualActive.value)

function manualInteraction() {
  if (tour.state.value !== 'idle') tour.stop()
}

function changeRange(value) {
  manualInteraction()
  setRange(value)
}

function changeSegment(value) {
  manualInteraction()
  setSegment(value)
}

function selectRecord(record) {
  manualInteraction()
  selectedRecord.value = record
  highlight('ranking')
}

function selectKpi(kpi) {
  manualInteraction()
  if (kpi.id === 'recall' || kpi.id === 'averageTraffic') highlight('experience')
  else if (kpi.id === 'concentration') highlight('ranking')
  else if (kpi.id === 'traffic') highlight('flow')
  else highlight('kpis')
}
</script>

<template>
  <div class="dashboard-shell">
    <div class="ambient ambient-one"></div>
    <div class="ambient ambient-two"></div>

    <DashboardHeader
      :source="dashboard?.source"
      :filters="filters"
      :tour-state="tour.state.value"
      :tour-step="tour.stepIndex.value"
      :tour-total="tour.totalSteps"
      @range-change="changeRange"
      @segment-change="changeSegment"
      @tour-start="tour.start"
      @tour-pause="tour.pause"
      @tour-resume="tour.resume"
      @tour-restart="tour.restart"
    />

    <div v-if="loading && !dashboard" class="loading-state" aria-live="polite">
      <span class="loading-ring"></span><strong>正在装载脱敏聚合数据</strong><small>StaticSampleDataAdapter · v2026.08.02</small>
    </div>
    <div v-else-if="error && !dashboard" class="error-state" role="alert">
      <strong>数据装载失败</strong><span>{{ error }}</span><button type="button" @click="reload">重新加载</button>
    </div>

    <main v-if="dashboard" class="dashboard-content" :class="{ 'is-refreshing': loading }">
      <section class="kpi-grid" :class="{ 'tour-highlight': activeStep === 'kpis' }" aria-label="核心洞察指标" data-testid="kpi-grid">
        <KpiCard v-for="(kpi, index) in dashboard.kpis" :key="kpi.id" :kpi="kpi" :index="index + 1" :active="activeStep === 'kpis'" @select="selectKpi" />
      </section>

      <section class="analytics-grid">
        <div class="left-column">
          <PanelFrame title="活跃用户与漫游流量趋势" eyebrow="ACTIVE USERS & ROAMING TRAFFIC">
            <TrafficTrendChart :data="dashboard.trend" />
          </PanelFrame>
          <PanelFrame title="用户体验行为信号" eyebrow="EXPERIENCE BEHAVIOR SIGNALS" :active="activeStep === 'experience'">
            <template #header><span class="panel-badge">月度多标签</span></template>
            <ExperienceSignals :data="dashboard.experienceSignals" :selected="filters.segment" />
          </PanelFrame>
        </div>

        <div class="center-column">
          <PanelFrame title="样本覆盖与跨境使用场景" eyebrow="SAMPLE COVERAGE & USAGE SCENARIO" :active="activeStep === 'flow'">
            <template #header><span class="panel-badge">真实样本 / 单侧覆盖</span></template>
            <RoamingFlowMap :flows="dashboard.flows" :active="activeStep === 'flow'" />
          </PanelFrame>
          <PanelFrame title="重点客群与运营机会" eyebrow="AUDIENCE OPPORTUNITIES" :active="activeStep === 'value'">
            <template #header><span class="threshold-note">候选群体可重叠</span></template>
            <OpportunityPanel :value="dashboard.value" />
          </PanelFrame>
        </div>

        <div class="right-column">
          <PanelFrame title="高用量重点关怀用户 TOP 10" eyebrow="HIGH-USAGE CUSTOMER FOCUS" :active="activeStep === 'ranking'">
            <template #header><span class="panel-badge">流量贡献</span></template>
            <HighValueRanking :records="dashboard.highValueRecords" @select="selectRecord" />
          </PanelFrame>
          <PanelFrame title="近期重点关怀用户" eyebrow="RECENT CUSTOMER FOCUS" compact>
            <template #header><span class="queue-count">{{ dashboard.recentFocusUsers.length }} 个脱敏样本</span></template>
            <RecentFocusList :records="dashboard.recentFocusUsers" @select="selectRecord" />
          </PanelFrame>
        </div>
      </section>

      <section class="bottom-grid">
        <PanelFrame title="用户体验改善路径" eyebrow="EXPERIENCE IMPROVEMENT" :active="activeStep === 'experience'" compact>
          <template #header><span class="panel-badge">从行为信号到服务动作</span></template>
          <ExperiencePathPanel :value="dashboard.value" />
        </PanelFrame>
        <PanelFrame title="公司价值转化" eyebrow="COMPANY VALUE CONVERSION" :active="activeStep === 'value'" compact>
          <ValuePanel :value="dashboard.value" />
        </PanelFrame>
        <PanelFrame title="数据可信度与适用边界" eyebrow="DATA TRUST & SCOPE" :active="activeStep === 'pipeline'" compact>
          <PipelineStatus :items="dashboard.pipeline" />
        </PanelFrame>
      </section>
    </main>

    <footer class="dashboard-footer">
      <span>指标口径：流量统一为 bytes · 文件标称周期 2026-07 · 客群为可重叠行为标签</span>
      <span>真实静态样本 · 不进行双边结算稽核 · 运营效果需后续业务数据验证</span>
    </footer>

    <div v-if="tour.state.value !== 'idle'" class="tour-status" aria-live="polite">
      <span class="tour-wave"></span>
      <div><small>演示导览</small><strong>{{ tour.stepIndex.value + 1 }} / {{ tour.totalSteps }} · {{ activeStep }}</strong></div>
    </div>

    <CdrDetailDrawer :record="selectedRecord" @close="selectedRecord = null" />
  </div>
</template>
