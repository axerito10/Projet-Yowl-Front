import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className='font-Avenir pr-10 pl-10 pt-10 pb-10 '>
      <div className="">
        <div className="-mt"> 
            <h1 className="text-4xl font-bold flex items-center mb-12">
              <img
                className="h-14 mr- align-middle"
                src="https://cdn.discordapp.com/attachments/1182732629573910569/1196830881592131677/Logo_2_Skills.png"
                alt="Skills logo"
              />
              <span className="text-7xl">KILLS</span>
            </h1>
          </div>

        <h2 className='text-4xl text-center'>Conditions générales d'utilisation - Données personnelles</h2><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>Définitions :</h3><br></br>
        <ul>
          <li>L'Éditeur : La personne, physique ou morale, qui édite les services de communication au public en ligne.</li>
          <li>Le Site : L'ensemble des sites, pages Internet et services en ligne proposés par l'Éditeur.</li>
          <li>L'Utilisateur : La personne utilisant le Site et les services.</li>
        </ul><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>1- Nature des données collectées</h3>
        <p>
          Dans le cadre de l'utilisation des Sites, l'Éditeur est susceptible de collecter les catégories de données suivantes
          concernant ses Utilisateurs : Données d'état-civil, d'identité, d'identification...
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>2- Communication des données personnelles à des tiers</h3>
        <p>Pas de communication à des tiers</p>
        <p>
          Vos données ne font l'objet d'aucune communication à des tiers. Vous êtes toutefois informés qu'elles pourront être
          divulguées en application d'une loi, d'un règlement ou en vertu d'une décision d'une autorité réglementaire ou judiciaire
          compétente.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>3- Information préalable pour la communication des données personnelles à des tiers en cas de fusion / absorption</h3>
        <p>Collecte de l’opt-in (consentement) préalable à la transmission des données suite à une fusion / acquisition</p>
        <p>
          Dans le cas où nous prendrions part à une opération de fusion, d’acquisition ou à toute autre forme de cession d’actifs,
          nous nous engageons à obtenir votre consentement préalable à la transmission de vos données personnelles et à maintenir
          le niveau de confidentialité de vos données personnelles auquel vous avez consenti.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>4- Agrégation des données</h3>
        <p>Agrégation avec des données non personnelles</p>
        <p>
          Nous pouvons publier, divulguer et utiliser les informations agrégées (informations relatives à tous nos Utilisateurs
          ou à des groupes ou catégories spécifiques d'Utilisateurs que nous combinons de manière à ce qu'un Utilisateur individuel
          ne puisse plus être identifié ou mentionné) et les informations non personnelles à des fins d'analyse du secteur et du
          marché, de profilage démographique, à des fins promotionnelles et publicitaires et à d'autres fins commerciales.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>5- Collecte des données d'identité</h3>
        <p>Utilisation d’un pseudonyme</p>
        <p>
          L’utilisation du Site nécessite une inscription sans identification préalable. Elle peut s’effectuer sans que vous ne
          communiquiez de données nominatives vous concernant (nom, prénom, adresse, etc). Vous pouvez utiliser le pseudonyme de
          votre choix.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>6- Collecte des données d'identification</h3>
        <p>Utilisation de l'identifiant de l’utilisateur uniquement pour l’accès aux services</p>
        <p>
          Nous utilisons vos identifiants électroniques seulement pour et pendant l'exécution du contrat.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>7- Collecte des données du terminal</h3>
        <p>Aucune collecte des données techniques</p>
        <p>
          Nous ne collectons et ne conservons aucune donnée technique de votre appareil (adresse IP, fournisseur d'accès à
          Internet...).
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>8- Cookies</h3>
        <p>Durée de conservation des cookies</p>
        <p>
          Conformément aux recommandations de la CNIL, la durée maximale de conservation des cookies est de 13 mois au maximum
          après leur premier dépôt dans le terminal de l'Utilisateur, tout comme la durée de la validité du consentement de
          l’Utilisateur à l’utilisation de ces cookies. La durée de vie des cookies n’est pas prolongée à chaque visite. Le
          consentement de l’Utilisateur devra donc être renouvelé à l'issue de ce délai.
        </p><br></br>
        <p>Finalité cookies</p>
        <p>
          Les cookies peuvent être utilisés pour des fins statistiques notamment pour optimiser les services rendus à
          l'Utilisateur, à partir du traitement des informations concernant la fréquence d'accès, la personnalisation des pages
          ainsi que les opérations réalisées et les informations consultées.
        </p><br></br>
        <p>
          Vous êtes informé que l'Éditeur est susceptible de déposer des cookies sur votre terminal. Le cookie enregistre des
          informations relatives à la navigation sur le service (les pages que vous avez consultées, la date et l'heure de la
          consultation...) que nous pourrons lire lors de vos visites ultérieures.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>Droit de l'Utilisateur de refuser les cookies, la désactivation entraînant un fonctionnement dégradé du service</h3>
        <p>
          Vous reconnaissez avoir été informé que l'Éditeur peut avoir recours à des cookies, et l'y autorisez. Si vous ne
          souhaitez pas que des cookies soient utilisés sur votre terminal, la plupart des navigateurs vous permettent de
          désactiver les cookies en passant par les options de réglage. Toutefois, vous êtes informé que certains services sont
          susceptibles de ne plus fonctionner correctement.
        </p><br></br>
        <p>
          Association possible des cookies avec des données personnelles pour permettre le fonctionnement du service L'Éditeur
          peut être amenée à recueillir des informations de navigation via l'utilisation de cookies.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>9 - Conservation des données techniques</h3>
        <p>Durée de conservation des données techniques</p>
        <p>
          Les données techniques sont conservées pour la durée strictement nécessaire à la réalisation des finalités visées
          ci-avant.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>10- Délai de conservation des données personnelles et d'anonymisation</h3>
        <p>Conservation des données pendant la durée de la relation contractuelle</p>
        <p><br></br>
          Conformément à l'article 6-5° de la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux
          libertés, les données à caractère personnel faisant l'objet d'un traitement ne sont pas conservées au-delà du temps
          nécessaire à l'exécution des obligations définies lors de la conclusion du contrat ou de la durée prédéfinie de la
          relation contractuelle.
        </p><br></br>
        <p>
          Conservation des données anonymisées au-delà de la relation contractuelle / après la suppression du compte Nous
          conservons les données personnelles pour la durée strictement nécessaire à la réalisation des finalités décrites dans
          les présentes CGU. Au-delà de cette durée, elles seront anonymisées et conservées à des fins exclusivement statistiques
          et ne donneront lieu à aucune exploitation, de quelque nature que ce soit.
        </p><br></br>
        <p>Suppression des données après suppression du compte</p><br></br>
        <p>
          Des moyens de purge de données sont mis en place afin d'en prévoir la suppression effective dès lors que la durée de
          conservation ou d'archivage nécessaire à l'accomplissement des finalités déterminées ou imposées est atteinte.
          Conformément à la loi n°78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, vous disposez
          par ailleurs d'un droit de suppression sur vos données que vous pouvez exercer à tout moment en prenant contact avec
          l'Éditeur.
        </p><br></br>
        <p>Suppression des données après 3 ans d'inactivité</p><br></br>
        <p>
          Pour des raisons de sécurité, si vous ne vous êtes pas authentifié sur le Site pendant une période de trois ans, vous
          recevrez un e-mail vous invitant à vous connecter dans les plus brefs délais, sans quoi vos données seront supprimées
          de nos bases de données.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>11- Suppression du compte</h3>
        <p>Suppression du compte à la demande</p><br></br>
        <p>
          L'Utilisateur a la possibilité de supprimer son Compte à tout moment, par simple demande à l'Éditeur OU par le menu de
          suppression de Compte présent dans les paramètres du Compte le cas échéant.
        </p><br></br>
        <p>Suppression du compte en cas de violation des CGU</p><br></br>
        <p>
          En cas de violation d'une ou de plusieurs dispositions des CGU ou de tout autre document incorporé aux présentes par
          référence, l'Éditeur se réserve le droit de mettre fin ou restreindre sans aucun avertissement préalable et à sa seule
          discrétion, votre usage et accès aux services, à votre compte et à tous les Sites.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>12- Indications en cas de faille de sécurité décelée par l'Éditeur</h3>
        <p>Information de l'Utilisateur en cas de faille de sécurité</p><br></br>
        <p>
          Nous nous engageons à mettre en œuvre toutes les mesures techniques et organisationnelles appropriées afin de garantir un
          niveau de sécurité adapté au regard des risques d'accès accidentels, non autorisés ou illégaux, de divulgation,
          d'altération, de perte ou encore de destruction des données personnelles vous concernant. Dans l'éventualité où nous
          prendrions connaissance d'un accès illégal aux données personnelles vous concernant stockées sur nos serveurs ou ceux de
          nos prestataires, ou d'un accès non autorisé ayant pour conséquence la réalisation des risques identifiés ci-dessus,
          nous nous engageons à :
        </p><br></br>
        <ul>
          <li>Vous notifier l'incident dans les plus brefs délais ;</li>
          <li>Examiner les causes de l'incident et vous en informer ;</li>
          <li>
            Prendre les mesures nécessaires dans la limite du raisonnable afin d'amoindrir les effets négatifs et préjudices
            pouvant résulter dudit incident.
          </li>
        </ul><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>13- Transfert des données personnelles à l'étranger</h3>
        <p>Transfert des données dans des pays avec un niveau de protection équivalent</p><br></br>
        <p>
          L'Éditeur s'engage à respecter la réglementation applicable relative aux transferts des données vers des pays étrangers
          et notamment selon les modalités suivantes :
        </p><br></br>
        <ul>
          <li>L'Éditeur transfère les données personnelles de ses Utilisateurs vers des pays reconnus comme offrant un niveau de protection équivalent.</li>
          <li>L'Éditeur transfère les données personnelles de ses Utilisateurs en dehors des pays reconnus par la CNIL comme ayant un niveau de protection suffisant : L'Éditeur a obtenu une autorisation de la CNIL pour procéder à ce transfert.</li>
        </ul>
        <p>Pour connaître la liste de ces pays : <a href="https://www.cnil.fr/fr/la-protection-des-donnees-dans-le-monde">CNIL - La protection des données dans le monde</a></p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>14- Modification des CGU et de la politique de confidentialité</h3>
        <p>
          En cas de modification des présentes CGU, engagement de ne pas baisser le niveau de confidentialité de manière
          substantielle sans l'information préalable des personnes concernées Nous nous engageons à vous informer en cas de
          modification substantielle des présentes CGU, et à ne pas baisser le niveau de confidentialité de vos données de manière
          substantielle sans vous en informer et obtenir votre consentement.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>15- Droit applicable et modalités de recours</h3>
        <p>Clause d'arbitrage</p><br></br>
        <p>
          Vous acceptez expressément que tout litige susceptible de naître du fait des présentes CGU, notamment de son interprétation
          ou de son exécution, relèvera d'une procédure d'arbitrage soumise au règlement de la plateforme d'arbitrage choisie d'un
          commun accord, auquel vous adhérerez sans réserve.
        </p><br></br>

        <h3 className='text-2xl text-custom-orange font-bold'>16- Portabilité des données</h3>
        <p>Portabilité des données</p><br></br>
        <p>
        L'Éditeur s'engage à vous offrir la possibilité de vous faire restituer l'ensemble des données vous concernant sur simple demande.
          L'Utilisateur se voit ainsi garantir une meilleure maîtrise de ses données, et garde la possibilité de les réutiliser. Ces données
          devront être fournies dans un format ouvert et aisément réutilisable.
        </p><br></br>
        <Link to="/register" className="bg-custom-orange hover:bg-custom-hoverorange text-custom-blue p-2 rounded-3xl text-center block size-13">retour</Link>
        </div>
      </div>
  );
};

export default PrivacyPolicy;
