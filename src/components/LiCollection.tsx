
import { useCachedMaxIndex } from '@/hooks/useDataSave';
import { useCachedUserCounts } from '@/hooks/useDataSaveU';

interface Props {
    title: string;
    className?: string;
    uid: string;
    type: string;
    oTitle?: string
}

const LiCollection: React.FC<Props> = ({ title, className = '', uid, type, oTitle = '' }) => {    
    const maxIndexTe = type.length > 0 ?useCachedMaxIndex('Consumibles', type)  :useCachedMaxIndex(title, type) ; 
    const { countByTypeS, userCountS } = useCachedUserCounts(uid, title, type);
    

    return (
        <button className={`${className} shadow-lg primary-text transition-all font-bold`}>
            <h1>{oTitle.length > 0? title + oTitle : title}</h1>
            <p className={'font-semibold text-lg'}>
                {type.length > 0 ? countByTypeS : userCountS}
                /
                {maxIndexTe}
            </p>
        </button>
    );
};

export default LiCollection;
