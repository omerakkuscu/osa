import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { ProductDetail } from '../components/ProductDetail'
import { useLanguage } from '../LanguageContext'
import { useProducts } from '../hooks/useProducts'

export default function ProductDetailPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { id } = useParams()
  const { products, loading } = useProducts()
  const product = products.find(p => p.id === Number(id))

  if (!product) {
    return <Layout>
      <section className="carbon-bg py-24 text-center"><p className="text-white/60">{loading ? '…' : t('product_not_found')}</p></section>
    </Layout>
  }

  return <Layout>
    <section className="carbon-bg relative py-16 md:py-28">
      <div className="section-wrap relative z-10">
        <ProductDetail product={product} onBack={() => navigate('/customs')} />
      </div>
    </section>
  </Layout>
}
