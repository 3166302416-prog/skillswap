import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type SkillCard = { id: string; name: string; avatar: string; teaches: string; learns: string; isMine?: boolean }

const demoCards: SkillCard[] = [
  { id: 'lin', name: '林然', avatar: '林', teaches: 'Python', learns: '摄影' },
  { id: 'zhou', name: '周沐', avatar: '周', teaches: '摄影', learns: 'Python' },
  { id: 'chen', name: '陈溪', avatar: '陈', teaches: '吉他', learns: '英语' },
  { id: 'he', name: '何语', avatar: '何', teaches: '英语', learns: '吉他' },
]
const storageKey = 'skillswap-my-card'
const normalise = (skill: string) => skill.trim().toLowerCase()

function App() {
  const [teaches, setTeaches] = useState('')
  const [learns, setLearns] = useState('')
  const [myCard, setMyCard] = useState<SkillCard | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) try { setMyCard(JSON.parse(saved) as SkillCard) } catch { localStorage.removeItem(storageKey) }
  }, [])

  const cards = useMemo(() => (myCard ? [myCard, ...demoCards] : demoCards), [myCard])
  const matches = useMemo(() => !myCard ? [] : demoCards.filter((card) => normalise(myCard.teaches) === normalise(card.learns) && normalise(myCard.learns) === normalise(card.teaches)), [myCard])

  function publishCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const teach = teaches.trim(), learn = learns.trim()
    if (!teach || !learn) { setNotice('请先填写你能教和想学的技能。'); return }
    const card = { id: 'mine', name: '我的技能名片', avatar: '我', teaches: teach, learns: learn, isMine: true }
    setMyCard(card); localStorage.setItem(storageKey, JSON.stringify(card)); setNotice('发布成功！你的技能名片已加入技能广场。')
  }

  return <main>
    <header className="topbar"><a className="brand" href="#top" aria-label="SkillSwap 首页"><span>✦</span> SkillSwap</a><nav aria-label="主导航"><a href="#publish">发布技能</a><a href="#square">技能广场</a></nav></header>
    <section className="hero" id="top"><p className="eyebrow">Skill exchange, made simple</p><h1>以你所长，换你所学。</h1><p className="hero-copy">把你擅长的事分享出去，也从他人的热爱中学到新技能。<br />无需课程费用，一次真诚的交换就够了。</p><a className="primary-link" href="#publish">创建我的技能名片 <span>→</span></a><div className="skill-orbit" aria-hidden="true"><span>Python</span><span>摄影</span><span>吉他</span><span>日语</span><i>↔</i></div></section>
    <section className="publish-section" id="publish"><div className="section-heading"><p className="eyebrow">01 / 我的技能名片</p><h2>从一次交换开始</h2><p>告诉大家你愿意分享什么，又想收获什么。</p></div><form className="publish-form" onSubmit={publishCard}><label><span>我能教什么？</span><input value={teaches} onChange={(e) => setTeaches(e.target.value)} placeholder="例如：Python、摄影、吉他" maxLength={30} /></label><label><span>我想学什么？</span><input value={learns} onChange={(e) => setLearns(e.target.value)} placeholder="例如：视频剪辑、日语、UI 设计" maxLength={30} /></label><button type="submit">发布我的技能名片 <span>→</span></button>{notice && <p className="notice" role="status">{notice}</p>}</form></section>
    {myCard && <section className="my-card-section" aria-live="polite"><div><p className="eyebrow">已发布</p><h2>这是你的技能名片</h2></div><SkillCardView card={myCard} featured /></section>}
    {matches.length > 0 && <section className="match-banner" aria-live="polite"><span className="match-icon">✦</span><div><strong>双向技能匹配成功</strong><p>你和 {matches.map((card) => card.name).join('、')} 可以互相学习，去技能广场看看吧。</p></div></section>}
    <section className="square-section" id="square"><div className="square-heading"><div><p className="eyebrow">02 / 技能广场</p><h2>遇见你的交换搭子</h2></div><p>已有 {cards.length} 张技能名片</p></div><div className="cards-grid">{cards.map((card) => <SkillCardView card={card} key={card.id} />)}</div></section>
    <footer>
      <span>SkillSwap · Teach what you know. Learn what you love.</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备2026126857号</a>
    </footer>
  </main>
}

function SkillCardView({ card, featured = false }: { card: SkillCard; featured?: boolean }) {
  return <article className={`skill-card ${card.isMine || featured ? 'mine' : ''}`}><div className="card-person"><span className="avatar">{card.avatar}</span><div><strong>{card.name}</strong><small>{card.isMine ? '刚刚发布' : '正在寻找交换伙伴'}</small></div></div><div className="skill-row"><span>我能教</span><b>{card.teaches}</b></div><div className="swap-line">↕</div><div className="skill-row"><span>我想学</span><b>{card.learns}</b></div></article>
}
export default App
