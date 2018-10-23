import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import AssetIcon from '../AssetIcon';
import Identicon from '../Identicon';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import StyledButton from '../StyledButton';
import { colors, fontStyles } from '../../styles/common';
import { strings } from '../../../locales/i18n';

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: 20,
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: colors.borderColor
	},
	assetLogo: {
		marginTop: 15,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		marginBottom: 10
	},
	balance: {
		flex: 1,
		alignItems: 'center',
		marginTop: 10,
		marginBottom: 10
	},
	buttons: {
		flex: 1,
		flexDirection: 'row',
		marginTop: 30
	},
	amount: {
		fontSize: 30,
		color: colors.fontPrimary,
		...fontStyles.normal
	},
	amountFiat: {
		fontSize: 18,
		color: colors.fontSecondary,
		...fontStyles.light
	},
	button: {
		flex: 1,
		flexDirection: 'row'
	},
	leftButton: {
		marginRight: 10
	},
	rightButton: {
		marginLeft: 10
	},
	buttonText: {
		marginLeft: 8,
		fontSize: 15,
		color: colors.white,
		textTransform: 'uppercase',
		...fontStyles.bold
	}
});

/**
 * View that displays the information of a specific asset (Token or ETH)
 * including the overview (Amount, Balance, Symbol, Logo)
 */
export default class AssetOverview extends Component {
	static propTypes = {
		/**
		 * Object that represents the asset to be displayed
		 */
		asset: PropTypes.object
	};
	onDeposit = () => true;
	onSend = () => true;

	render() {
		const {
			asset: { address, logo, symbol, balance, balanceFiat }
		} = this.props;
		return (
			<LinearGradient colors={[colors.slate, colors.white]} style={styles.wrapper}>
				<View style={styles.assetLogo}>
					{logo ? <AssetIcon logo={logo} /> : <Identicon address={address} />}
				</View>
				<View style={styles.balance}>
					<Text style={styles.amount}>
						{' '}
						{balance} {symbol}
					</Text>
					<Text style={styles.amountFiat}>{balanceFiat}</Text>
				</View>
				<View style={styles.buttons}>
					<StyledButton
						type={'confirm'}
						onPress={this.onSend}
						containerStyle={[styles.button, styles.leftButton]}
					>
						<MaterialIcon name={'send'} size={15} color={colors.white} />
						<Text style={styles.buttonText}>{strings('assetOverview.send_button')}</Text>
					</StyledButton>
					<StyledButton
						type={'confirm'}
						onPress={this.onDeposit}
						containerStyle={[styles.button, styles.rightButton]}
					>
						<FoundationIcon name={'download'} size={20} color={colors.white} />
						<Text style={styles.buttonText}>{strings('assetOverview.receive_button')}</Text>
					</StyledButton>
				</View>
			</LinearGradient>
		);
	}
}
