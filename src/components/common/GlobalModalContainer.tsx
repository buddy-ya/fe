import React from 'react';
import { useModalStore } from '@/store';
import {
  ChatOptionModal,
  CommentOptionModal,
  FeedOptionModal,
} from '@/components/modal/BottomOption';
import { StudentCertificationModal } from '@/components/modal/Common';
import { ChatRequestModal } from '@/components/modal/Common/ChatRequestModal';
import { BlockModal, ExitModal, ReportModal } from '../modal';

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
    </>
  );
}
