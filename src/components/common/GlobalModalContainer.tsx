import React from 'react';
import { useModalStore, useUserStore } from '@/store';
import {
  ChatOptionModal,
  CommentOptionModal,
  FeedOptionModal,
} from '@/components/modal/BottomOption';
import { StudentCertificationModal } from '@/components/modal/Common';
import { ChatRequestModal } from '@/components/modal/Common/ChatRequestModal';
import { BlockModal, ExitModal, ReportModal } from '../modal';
import { BannedUserModal } from '../modal/BannedUserModal';
import { MatchRequestModal } from '../modal/MatchRequestModal';
import { NoResponseModal } from '../modal/NoResponseModal';
import { PointModal } from '../modal/PointModal';

export function GlobalModalContainer() {
  const { visible, modalProps, handleClose } = useModalStore();

  return (
    <>
      {visible.studentCertification && (
        <StudentCertificationModal
          {...modalProps.studentCertification}
          visible={true}
          onClose={() => handleClose('studentCertification')}
        />
      )}
      {visible.feed && (
        <FeedOptionModal {...modalProps.feed} visible={true} onClose={() => handleClose('feed')} />
      )}
      {visible.comment && (
        <CommentOptionModal
          {...modalProps.comment}
          visible={true}
          onClose={() => handleClose('comment')}
        />
      )}
      {visible.chat && (
        <ChatOptionModal {...modalProps.chat} visible={true} onClose={() => handleClose('chat')} />
      )}
      {visible.report && (
        <ReportModal {...modalProps.report} visible={true} onClose={() => handleClose('report')} />
      )}
      {visible.block && (
        <BlockModal {...modalProps.block} visible={true} onClose={() => handleClose('block')} />
      )}
      {visible.exit && (
        <ExitModal {...modalProps.exit} visible={true} onClose={() => handleClose('exit')} />
      )}
      {visible.chatRequest && (
        <ChatRequestModal
          {...modalProps.chatRequest}
          visible={true}
          onClose={() => handleClose('chatRequest')}
        />
      )}
      {visible.matchRequest && (
        <MatchRequestModal
          {...modalProps.matchRequest}
          visible={true}
          onClose={() => handleClose('matchRequest')}
        />
      )}
      {visible.point && (
        <PointModal {...modalProps.point} visible={true} onClose={() => handleClose('point')} />
      )}
      {visible.banned && <BannedUserModal {...modalProps.banned} visible={true} />}
      {visible.noResponse && (
        <NoResponseModal
          {...modalProps.noResponse}
          visible={true}
          onClose={() => handleClose('noResponse')}
        />
      )}
    </>
  );
}
