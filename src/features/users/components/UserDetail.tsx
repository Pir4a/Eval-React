import { useParams } from 'react-router-dom'
import { Spinner } from '../../../shared/atoms/Spinner'
import { ErrorMessage } from '../../../shared/molecules/ErrorMessage'
import { useUser } from '../hooks/useUsers'
import { InfoCard } from '../../../shared/organisms/InfoCard'
import AnimatedContent from '@/shared/animate'

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const { user, loading, error, refetch } = useUser(id)

  if (loading) {
    return (
      <div className="mx-auto max-w-full px-4 py-6 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <Spinner /> Chargement...
      </div>
    )
  }
  if (error) return <div className="mx-auto max-w-3xl px-4 py-6"><ErrorMessage message={error} onRetry={refetch} /></div>
  if (!user) return null

  return (
    <AnimatedContent
      distance={50}
      direction="vertical"
      reverse={false}
      duration={1.2}
      ease="easeInOut"
      initialOpacity={0.2}
      animateOpacity={true}
    > 
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

      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          title="Informations"
          items={[
            { label: 'Âge', value: user.age },
            { label: 'Genre', value: user.gender },
            { label: 'Date de naissance', value: user.birthDate },
            { label: 'Groupe sanguin', value: user.bloodGroup },
            { label: 'Taille', value: user.height },
            { label: 'Poids', value: user.weight },
            { label: 'Yeux', value: user.eyeColor },
            { label: 'Cheveux', value: user.hair?.color ? `${user.hair.color}${user.hair?.type ? ` (${user.hair.type})` : ''}` : undefined },
            { label: 'Téléphone', value: user.phone },
            { label: 'Username', value: user.username },
            { label: 'IP', value: user.ip },
            { label: 'Mac', value: user.macAddress },
            { label: 'Nom de jeune fille', value: user.maidenName },
            { label: 'Rôle', value: user.role },
            { label: 'Université', value: user.university },
            { label: 'EIN', value: user.ein },
            { label: 'SSN', value: user.ssn },
            { label: 'User Agent', value: user.userAgent },
          ]}
        />

        <InfoCard
          title="Adresse"
          items={[
            { label: 'Rue', value: user.address?.address },
            { label: 'Ville', value: user.address?.city },
            { label: 'État', value: user.address?.state },
            { label: 'Code postal', value: user.address?.postalCode },
          ]}
        />

        <InfoCard
          title="Société"
          items={[
            { label: 'Nom', value: user.company?.name },
            { label: 'Département', value: user.company?.department },
            { label: 'Titre', value: user.company?.title },
          ]}
        />

        <InfoCard
          title="Banque"
          items={[
            { label: 'Type', value: user.bank?.cardType },
            { label: 'Numéro', value: user.bank?.cardNumber },
            { label: 'Expiration', value: user.bank?.cardExpire },
            { label: 'IBAN', value: user.bank?.iban },
          ]}
        />

        <InfoCard
          title="Crypto"
          items={[
            { label: 'Monnaie', value: user.crypto?.coin },
            { label: 'Réseau', value: user.crypto?.network },
            { label: 'Wallet', value: user.crypto?.wallet },
          ]}
        />
      </div>
    </div>
    </AnimatedContent>
  )
}


