import { useParams } from 'react-router-dom'
import { Spinner } from '../../../components/ui/Spinner'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { useUser } from '../hooks/useUsers'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, loading, error, refetch } = useUser(id)

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <Spinner /> Chargement...
      </div>
    )
  }
  if (error) return <div className="mx-auto max-w-3xl px-4 py-6"><ErrorMessage message={error} onRetry={refetch} /></div>
  if (!user) return null

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="flex items-start gap-4">
        <img
          src={user.image || `https://api.dicebear.com/9.x/initials/svg?seed=${user.firstName}+${user.lastName}`}
          alt={`${user.firstName} ${user.lastName}`}
          className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-800"
        />
        <div>
          <h1 className="text-2xl font-semibold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h2 className="font-medium mb-2">Informations</h2>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>Âge: {user.age ?? '—'}</li>
            <li>Genre: {user.gender ?? '—'}</li>
            <li>Date de naissance: {user.birthDate ?? '—'}</li>
            <li>Groupe sanguin: {user.bloodGroup ?? '—'}</li>
            <li>Taille: {user.height ?? '—'}</li>
            <li>Poids: {user.weight ?? '—'}</li>
            <li>Yeux: {user.eyeColor ?? '—'}</li>
            <li>Cheveux: {user.hair?.color ?? '—'} {user.hair?.type ? `(${user.hair.type})` : ''}</li>
            <li>Téléphone: {user.phone ?? '—'}</li>
            <li>Username: {user.username ?? '—'}</li>
            <li>IP: {user.ip ?? '—'}</li>
            <li>Mac: {user.macAddress ?? '—'}</li>
            <li>Nom de jeune fille: {user.maidenName ?? '—'}</li>
            <li>Rôle: {user.role ?? '—'}</li>
            <li>Université: {user.university ?? '—'}</li>
            <li>EIN: {user.ein ?? '—'}</li>
            <li>SSN: {user.ssn ?? '—'}</li>
            <li>User Agent: {user.userAgent ?? '—'}</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h2 className="font-medium mb-2">Adresse</h2>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>Rue: {user.address?.address ?? '—'}</li>
            <li>Ville: {user.address?.city ?? '—'}</li>
            <li>État: {user.address?.state ?? '—'}</li>
            <li>Code postal: {user.address?.postalCode ?? '—'}</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h2 className="font-medium mb-2">Société</h2>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>Nom: {user.company?.name ?? '—'}</li>
            <li>Département: {user.company?.department ?? '—'}</li>
            <li>Titre: {user.company?.title ?? '—'}</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h2 className="font-medium mb-2">Banque</h2>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>Type: {user.bank?.cardType ?? '—'}</li>
            <li>Numéro: {user.bank?.cardNumber ?? '—'}</li>
            <li>Expiration: {user.bank?.cardExpire ?? '—'}</li>
            <li>IBAN: {user.bank?.iban ?? '—'}</li>
          </ul>
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4">
          <h2 className="font-medium mb-2">Crypto</h2>
          <ul className="text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
            <li>Monnaie: {user.crypto?.coin ?? '—'}</li>
            <li>Réseau: {user.crypto?.network ?? '—'}</li>
            <li>Wallet: {user.crypto?.wallet ?? '—'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}


