'use strict'

const db = uniCloud.database()
const userCollection = db.collection('uni-id-users')

const TEST_USERNAME_REGEXP = /^e2etest[a-z0-9]{4,13}$/
const UID_LENGTH = 24
const MAX_CLEANUP_AGE = 24 * 60 * 60 * 1000
const CLOCK_SKEW = 60 * 1000

function createResult(errCode, errMsg, deleted = 0) {
	return {
		errCode,
		errMsg,
		deleted
	}
}

function isValidUid(uid) {
	return typeof uid === 'string' && uid.length === UID_LENGTH
}

function isValidTestUsername(username) {
	return typeof username === 'string' && TEST_USERNAME_REGEXP.test(username)
}

function isValidCreatedAfter(createdAfter) {
	const now = Date.now()
	return typeof createdAfter === 'number' &&
		Number.isFinite(createdAfter) &&
		createdAfter >= now - MAX_CLEANUP_AGE &&
		createdAfter <= now + CLOCK_SKEW
}

module.exports = {
	async deleteRegisteredE2eTestAccount(params = {}) {
		const {
			uid,
			username,
			createdAfter
		} = params

		if (!isValidUid(uid)) {
			return createResult('e2e-test-account-cleaner-invalid-uid', 'Invalid uid')
		}
		if (!isValidTestUsername(username)) {
			return createResult('e2e-test-account-cleaner-invalid-username', 'Only e2e test accounts can be deleted')
		}
		if (!isValidCreatedAfter(createdAfter)) {
			return createResult('e2e-test-account-cleaner-invalid-created-after', 'Invalid createdAfter')
		}

		const userRes = await userCollection.doc(uid).get()
		const user = userRes.data && userRes.data[0]
		if (!user) {
			return createResult(0, '', 0)
		}
		if (user.username !== username) {
			return createResult('e2e-test-account-cleaner-account-mismatch', 'uid and username do not match')
		}
		if (typeof user.register_date !== 'number' || user.register_date < createdAfter - CLOCK_SKEW) {
			return createResult('e2e-test-account-cleaner-not-current-test-account', 'Account was not created by this test run')
		}

		const removeRes = await userCollection.where({
			_id: uid,
			username
		}).remove()
		const deleted = removeRes.deleted || removeRes.affectedDocs || 0
		return createResult(0, '', deleted)
	}
}
